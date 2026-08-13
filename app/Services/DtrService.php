<?php

namespace App\Services;

use App\DTOs\DtrData;
use App\DTOs\DtrUpdateData;
use App\Http\Resources\DtrResource;
use App\Models\Activity;
use App\Models\Dtr;
use App\Models\DtrCoordination;
use App\Models\Holiday;
use App\Models\IclockTransaction;
use App\Models\Memo;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use App\Models\PersonnelTraining;
use App\Models\Tko;
use App\Models\TravelOrder;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;
use App\Services\DtrFlexiScheduleService;
use Exception;
use Illuminate\Support\Facades\Storage;

class DtrService
{
    public function __construct(
        protected DtrFlexiScheduleService $flexi
    ) {}

    public function syncIclockToDtr()
    {
        // Group all biometric punches by employee and date.
        $punches = IclockTransaction::where('is_attendance', 1)
            ->orderBy('punch_time')
            ->get()
            ->groupBy(function ($item) {
                return $item->emp_code . '_' .
                    Carbon::parse($item->punch_time)->toDateString();
            });

        foreach ($punches as $dayPunches) {

            // Get the employee mapping from the biometric device.
            $employeeDevice = $dayPunches->first()->employee_transaction;

            if (!$employeeDevice) {
                Log::warning(
                    "No mapping for emp_code {$dayPunches->first()->emp_code}"
                );
                continue;
            }

            $employeeId = $employeeDevice->employee_id;

            $punchDate = Carbon::parse(
                $dayPunches->first()->punch_time
            )->toDateString();

            $employee = PersonnelEmployee::where(
                'employee_id',
                $employeeId
            )->first();

            if (!$employee) {
                throw new Exception(
                    "Employee not found: {$employeeId}"
                );
            }

            // Create today's DTR if it doesn't exist.
            $dtr = Dtr::firstOrNew(
                [
                    'employee_id' => $employeeId,
                    'punch_date'  => $punchDate,
                ],
                [
                    'flexi_type' => $employee->flexi_type,
                ]
            );


            /*
        |--------------------------------------------------------------------------
        | Determine day
        |--------------------------------------------------------------------------
        */

            $date = Carbon::parse($punchDate);

            $isWeekend = in_array(
                $date->dayOfWeek,
                [
                    Carbon::FRIDAY,
                    Carbon::SATURDAY,
                    Carbon::SUNDAY,
                ]
            );

            /**
             * Process punches according to the schedule.
             */
            if ($isWeekend) {
                $this->processWeekendPunches(
                    $dtr,
                    $dayPunches
                );
            } else {
                $this->processWeekdayPunches(
                    $dtr,
                    $dayPunches
                );
            }

            /*
        |--------------------------------------------------------------------------
        | WEEKEND
        |--------------------------------------------------------------------------
        */
            if ($isWeekend) {
                $dtr->tardiness = null;
                $dtr->undertime = null;

                // Compute overtime only if your policy allows it.
                if ($dtr->timeOut) {
                    $dtr->overtime = $this->flexi->overtime($dtr);
                }
            } else {
                if ($dtr->timeIn) {
                    $dtr->tardiness = $this->flexi->tardiness($dtr);
                }

                if ($dtr->timeOut) {

                    $dtr->undertime = $this->flexi->undertime($dtr);

                    $dtr->overtime = $this->flexi->overtime($dtr);
                }
            }

            $dtr->save();
        }
    }


    private function resolvePunchType(IclockTransaction $trx): string
    {
        $time = Carbon::parse($trx->punch_time);

        // Morning window → TIME IN
        if ($time->between(
            $time->copy()->setTime(5, 0),
            $time->copy()->setTime(11, 30)
        )) {
            return 'IN';
        }

        // Afternoon window → TIME OUT
        if ($time->between(
            $time->copy()->setTime(13, 30),
            $time->copy()->setTime(23, 59)
        )) {
            return 'OUT';
        }

        // Fallback to punch_state
        return $trx->punch_state == 0 ? 'IN' : 'OUT';
    }


    public function punchManual(string $employeeId, string $type, $latitude = null, $longitude = null, $photo = null): Dtr
    {
        $today = now()->toDateString();

        $employee = PersonnelEmployee::where('employee_id', $employeeId)->firstOrFail();

        $dtr = Dtr::firstOrCreate(
            [
                'employee_id' => $employeeId,
                'punch_date'  => $today,
            ],
            [
                'flexi_type' => $employee->flexi_type,
            ]
        );

        $allowed = ['timeIn', 'breakOut', 'breakIn', 'timeOut'];

        if (!in_array($type, $allowed)) {
            throw new \InvalidArgumentException('Invalid punch type');
        }

        // Prevent duplicate punch
        if ($dtr->$type) {
            return $dtr;
        }

        // Save punch time
        $dtr->update([
            $type => now()->format('H:i:s'),
        ]);

        // ✅ NEW: Save coordination if in_office = yes
        if ($employee->in_office == '1') {

            $photoPath = null;

            if ($photo) {
                $photoPath = $photo->store('dtr_photos', 'network');
            }

            DtrCoordination::create([
                'dtr_id'     => $dtr->id,
                'employee_id' => $employee->employee_id,
                'photo_path' => $photoPath,
                'latitude'   => $latitude,
                'longitude'  => $longitude,
                'type'       => $type, // VERY useful later
            ]);
        }

        if ($dtr->timeIn) {
            $dtr->tardiness = $this->flexi->tardiness($dtr);
        }
        // Calculate after timeout
        if ($type === 'timeOut') {
            $this->calculateDtr($dtr);
        }

        return $dtr;
    }


    public function calculateDtr(Dtr $dtr)
    {
        $dtr->update([
            'tardiness' => $this->flexi->tardiness($dtr),
            'undertime' => $this->flexi->undertime($dtr),
            'overtime'    => $this->flexi->overtime($dtr),
        ]);

        return $dtr;
    }


    public function buildEmployeeDtr($employeeId, $dateFrom, $dateTo)
    {
        $period = CarbonPeriod::create($dateFrom, $dateTo);

        // Get DTRs
        $dtrs = Dtr::where('employee_id', $employeeId)
            ->whereBetween('punch_date', [$dateFrom, $dateTo])
            ->get()
            ->keyBy(fn($dtr) => $dtr->punch_date->format('Y-m-d'));

        // Leaves (approved only if needed)
        $leaves = PersonnelLeave::where('employee_id', $employeeId)
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('start_date', [$dateFrom, $dateTo])
                    ->orWhereBetween('end_date', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('start_date', '<=', $dateFrom)
                            ->where('end_date', '>=', $dateTo);
                    });
            })
            ->get();

        // Activities where employee is participating
        $activities = Activity::whereHas('employees', function ($q) use ($employeeId) {
            $q->where('activity_employees.employee_id', $employeeId); // <- specify table
        })
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('dateFrom', [$dateFrom, $dateTo])
                    ->orWhereBetween('dateTo', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('dateFrom', '<=', $dateFrom)
                            ->where('dateTo', '>=', $dateTo);
                    });
            })
            ->get();

        // Training where employee is participating
        $trainings = PersonnelTraining::whereHas('employees', function ($q) use ($employeeId) {
            $q->where('training_employees.employee_id', $employeeId); // <- specify table
        })
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('dateFrom', [$dateFrom, $dateTo])
                    ->orWhereBetween('dateTo', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('dateFrom', '<=', $dateFrom)
                            ->where('dateTo', '>=', $dateTo);
                    });
            })
            ->get();



        $holidays = Holiday::whereBetween('holiday_date', [$dateFrom, $dateTo])
            ->get()
            ->keyBy(
                fn($holiday) =>
                Carbon::parse($holiday->holiday_date)->format('Y-m-d')
            );

        $memos = Memo::where(function ($query) use ($dateFrom, $dateTo) {
            $query->where('date_from', '<=', $dateTo)
                ->where('date_to', '>=', $dateFrom);
        })
            ->get()
            ->keyBy(fn($memo) => $memo->date_from);

        $tkos = Tko::where('employee_id', $employeeId)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->with('approvals')
            ->get()
            ->groupBy(fn($tko) => $tko->date);


        $employee = PersonnelEmployee::where('employee_id', $employeeId)->first();

        $travelOrders = TravelOrder::where('employee_id', $employee->iis_employee_id)
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('travel_departure_date', [$dateFrom, $dateTo])
                    ->orWhereBetween('travel_return_date', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('travel_departure_date', '<=', $dateFrom)
                            ->where('travel_return_date', '>=', $dateTo);
                    });
            })
            ->get();


        $result = [];

        foreach ($period as $date) {

            $dateStr = $date->format('Y-m-d');

            // =========================
            // PRE-CALCULATIONS (IMPORTANT)
            // =========================

            $travel = $travelOrders->first(function ($to) use ($dateStr) {
                $start = Carbon::parse($to->travel_departure_date)->format('Y-m-d');
                $end   = Carbon::parse($to->travel_return_date)->format('Y-m-d');
                return $dateStr >= $start && $dateStr <= $end;
            });

            $activity = $activities->first(function ($act) use ($dateStr) {
                $start = Carbon::parse($act->dateFrom)->format('Y-m-d');
                $end   = Carbon::parse($act->dateTo)->format('Y-m-d');
                return $dateStr >= $start && $dateStr <= $end;
            });

            $training = $trainings->first(function ($act) use ($dateStr) {
                $start = Carbon::parse($act->dateFrom)->format('Y-m-d');
                $end   = Carbon::parse($act->dateTo)->format('Y-m-d');
                return $dateStr >= $start && $dateStr <= $end;
            });

            $tko = $tkos[$dateStr] ?? null;

            $tko = $tko?->first(function ($item) {
                return $item->approvals->where('status', 'approved')->isNotEmpty();
            });

            $memo = collect($memos)->first(function ($memo) use ($dateStr, $employee) {

                $start = Carbon::parse($memo['date_from'])->format('Y-m-d');
                $end   = Carbon::parse($memo['date_to'])->format('Y-m-d');

                $isWithinDate = $dateStr >= $start && $dateStr <= $end;

                $isApplicableOffice = in_array(
                    $employee->province_office,
                    $memo['provinces'] ?? []
                );

                return $isWithinDate && $isApplicableOffice;
            });

            $leave = $leaves->first(function ($leave) use ($dateStr) {

                $start = Carbon::parse($leave->start_date)->format('Y-m-d');
                $end   = Carbon::parse($leave->end_date)->format('Y-m-d');

                $isWithinDate = $dateStr >= $start && $dateStr <= $end;

                $isApproved = $leave->approvals
                    ->where('status', 'approved')
                    ->isNotEmpty();

                return $isWithinDate && $isApproved;
            });

            $dtrRecord = $dtrs[$dateStr] ?? null;

            $isWorkContext =
                $dtrRecord ||
                $activity ||
                $training ||
                $travel ||
                $leave ||
                $memo ||
                $tko ||
                $holidays->has($dateStr) ||
                $dtrRecord?->remarks === 'FWA-B';


            // =========================
            // DTR (PRESENT / HALF-DAY)
            // =========================
            if ($dtrRecord) {

                $timeIn   = $dtrRecord->timeIn;
                $breakOut = $dtrRecord->breakOut;
                $breakIn  = $dtrRecord->breakIn;
                $timeOut  = $dtrRecord->timeOut;

                // ✅ APPLY TKO OVERRIDE
                if ($tko) {
                    $timeOut = $tko->tko_time;
                }

                $isHalfDay =
                    (
                        (empty($timeIn) && empty($breakOut)) ||
                        (empty($breakIn) && empty($timeOut))
                    )
                    && !$travel
                    && !$activity
                    && !$training
                    && !$memo
                    && !$leave
                    && !$tko;

                $result[] = [
                    'date'   => $dateStr,
                    'status' => $isHalfDay ? 'HALF-DAY' : 'PRESENT',
                    'dtr'    => $dtrRecord,
                    'leave'  => $leave,
                    'is_excused' => $travel
                        || $activity
                        || $training
                        || $memo
                        || $leave
                        || $tko,

                    // =========================
                    // REMARKS DATA (OVERLAYS)
                    // =========================
                    'travel_id'   => $travel?->travel_id,
                    'destination' => $travel?->travel_destination,
                    'purpose'     => $travel?->travel_purpose,

                    'soNumber'    => $activity?->soNumber,
                    'activity'    => $activity?->activityTypeBy?->name,

                    'soNumberTraining' => $training?->soNumber,
                    'title'    => $training?->title,

                    'memoNumber' => data_get($memo, 'memo_number'),
                    'memoStatus' => data_get($memo, 'status'),

                    'tkoType' => $tko?->tko_type,
                    'tkoTime' => $tko?->tko_time,

                ];

                continue;
            }

            // =========================
            // LEAVE
            // =========================

            if ($leave) {
                $result[] = [
                    'date'       => $dateStr,
                    'status'     => 'LEAVE',
                    'leave_type' => $leave->leaveType?->name,
                    'leave_id'   => $leave->id,
                ];
                continue;
            }

            // =========================
            // HOLIDAY
            // =========================
            if ($holidays->has($dateStr)) {
                $result[] = [
                    'date'         => $dateStr,
                    'status'       => 'HOLIDAY',
                    'holiday_name' => $holidays[$dateStr]->name,
                    'holiday_type' => $holidays[$dateStr]->type,
                ];
                continue;
            }

            // =========================
            // MANUAL MEMO / NO WORK
            // =========================
            if ($memo) {
                $result[] = [
                    'date'   => $dateStr,
                    'status'    => 'NO WORK',
                    'memo'      => $memo['title'],
                    'memo_type' => 'LGU MEMO',
                ];

                continue;
            }
            // =========================
            // TRAVEL ONLY (NO DTR)
            // =========================
            if ($travel && !($date->isSaturday() || $date->isSunday())) {
                $result[] = [
                    'date'        => $dateStr,
                    'status'      => 'TRAVEL',
                    'travel_id'   => $travel->travel_id,
                    'destination' => $travel->travel_destination,
                    'purpose'     => $travel->travel_purpose,

                    'soNumber'    => $activity?->soNumber,
                    'activity'    => $activity?->activityTypeBy?->name,
                ];
                continue;
            }

            // =========================
            // ACTIVITY + TRAVEL
            // =========================
            if ($activity) {
                $result[] = [
                    'date'        => $dateStr,
                    'status'      => 'ACTIVITY',
                    // Activity
                    'soNumber'    => $activity->soNumber,
                    'activity'    => $activity->activityTypeBy?->name,
                ];

                continue;
            }

            // =========================
            // TRAINING
            // =========================
            if ($training) {
                $result[] = [
                    'date'     => $dateStr,
                    'status'   => 'TRAINING',
                    'soNumber' => $training->soNumber,
                    'title'    => $training->title,
                ];
                continue;
            }



            // =========================
            // FWA-B (NO DTR OVERRIDE)
            // =========================
            if (($date->isFriday())) {
                $result[] = [
                    'date'   => $dateStr,
                    'status' => 'FWA-B',

                    'travel_id'   => $travel?->travel_id,
                    'destination' => $travel?->travel_destination,
                    'purpose'     => $travel?->travel_purpose,
                ];
                continue;
            }

            // =========================
            // WEEKEND (NO DTR OVERRIDE)
            // =========================
            if (($date->isSaturday() || $date->isSunday())) {
                $result[] = [
                    'date'   => $dateStr,
                    'status' => 'WEEKEND',

                    'travel_id'   => $travel?->travel_id,
                    'destination' => $travel?->travel_destination,
                    'purpose'     => $travel?->travel_purpose,
                ];
                continue;
            }

            // =========================
            // ABSENT
            // =========================
            if (!$isWorkContext && !$date->isSaturday() && !$date->isSunday()) {
                $result[] = [
                    'date'   => $dateStr,
                    'status' => 'ABSENT',
                ];
                continue;
            }
        }

        return $result;
    }

    public function timeToSeconds($time)
    {
        if (!$time) return 0;
        [$h, $m, $s] = explode(':', $time);
        return ($h * 3600) + ($m * 60) + $s;
    }


    public function getId($id)
    {
        $dtr = Dtr::with('employeeTransaction')->findOrFail($id);

        return new DtrResource($dtr);
    }

    public function updateDtr(DtrUpdateData $data, int $id): Dtr
    {
        $dtr = Dtr::findOrFail($id);

        $dtr->update([
            'timeIn' => $data->timeIn,
            'breakOut' => $data->breakOut,
            'breakIn' => $data->breakIn,
            'timeOut' => $data->timeOut,
        ]);

        $this->calculateDtr($dtr);

        $dtr->save();

        return $dtr;
    }

    public function calculateMonthlyLeaveCredit($employeeId, $leaveTypeId)
    {
        $period = Carbon::now()->subMonth();

        $start = $period->copy()->startOfMonth();
        $end   = $period->copy()->endOfMonth();

        $records = $this->buildEmployeeDtr(
            $employeeId,
            $start->toDateString(),
            $end->toDateString()
        );

        $validRecords = collect($records)
            ->where('is_excused', false);

        $absent = collect($records)->where('status', 'ABSENT')->count();
        $halfDay = collect($records)->where('status', 'HALF-DAY')->count();


        $totalTardinessSeconds = $validRecords->sum(function ($record) {
            return strtotime(data_get($record, 'dtr.tardiness', '00:00:00'))
                - strtotime('TODAY 00:00:00');
        });

        $totalUndertimeSeconds = $validRecords->sum(function ($record) {
            return strtotime(data_get($record, 'dtr.undertime', '00:00:00'))
                - strtotime('TODAY 00:00:00');
        });

        // Sum tardiness and undertime (in hours)
        $totalTardinessHours = $totalTardinessSeconds / 3600;
        $totalUndertimeHours = $totalUndertimeSeconds / 3600;

        $totalLateHours = $totalTardinessHours + $totalUndertimeHours;

        if ($leaveTypeId == 1) {
            return $this->calculateVacationLeaveCredit(
                $period,
                $absent,
                $halfDay,
                $totalTardinessHours,
                $totalUndertimeHours,
                $totalLateHours
            );
        }

        if ($leaveTypeId == 2) {
            return $this->calculateSickLeaveCredit(
                $period,
                $records
            );
        }

        return null;
    }

    private function calculateVacationLeaveCredit(
        $period,
        $absent,
        $halfDay,
        $tardinessHours,
        $undertimeHours,
        $lateHours
    ) {
        $lateEquivalent = floor(($lateHours / 8) * 1000) / 1000;
        // $lateDeduction = $lateEquivalent * 0.042;

        // $earned = 1.250
        //     - ($absent * 0.042)
        //     - ($halfDay * 0.021)
        //     - $lateDeduction;

        $earned = 1.250;

        return [
            'year' => $period->year,
            'month' => $period->month,
            'earned' => max(0, round($earned, 3)),
            'absent' => $absent,
            'half_day' => $halfDay,
            'tardiness_hours' => number_format($tardinessHours, 2, '.', ''),
            'undertime_hours' => number_format($undertimeHours, 2, '.', ''),
            'late_hours' => number_format($lateHours, 2, '.', ''),
            'late_equivalent' => number_format($lateEquivalent, 3, '.', ''),
            'remarks' => 'Vacation Leave Monthly Credit',
        ];
    }

    private function calculateSickLeaveCredit($period, $records)
    {
        $sickLeaveDays = 0;
        $sickLeaveHalfDays = 0;

        foreach ($records as $record) {

            // Check if this day has an approved Sick Leave
            if (
                isset($record['leave']) &&
                $record['leave'] &&
                $record['leave']->leave_type_id == 2
            ) {

                if ($record['status'] === 'HALF-DAY') {
                    $sickLeaveHalfDays++;
                } else {
                    $sickLeaveDays++;
                }
            }
        }

        $earned = 1.250
            - ($sickLeaveDays * 0.042)
            - ($sickLeaveHalfDays * 0.021);

        return [
            'year'      => $period->year,
            'month'     => $period->month,
            'earned'    => max(0, round($earned, 3)),
            'absent'    => 0,
            'half_day'  => 0,
            'tardiness_hours' => 0,
            'undertime_hours' => 0,
            'late_hours' => 0,
            'late_equivalent' => 0,
            'remarks' => 'Sick Leave Monthly Credit',
        ];
    }

    public function showPhoto(string $filename)
    {
        $filename = urldecode($filename);

        if (!Storage::disk('network')->exists($filename)) {
            abort(404, 'Photo not found');
        }

        return response(
            Storage::disk('network')->get($filename),
            200
        )->header(
            'Content-Type',
            Storage::disk('network')->mimeType($filename)
        );
    }


    private function processWeekdayPunches(Dtr $dtr, $dayPunches): void
    {
        // Track whether each DTR field has already been assigned.
        // This prevents later punches from overwriting the first valid one.
        $timeInAssigned = false;
        $breakOutAssigned = false;
        $breakInAssigned = false;

        foreach ($dayPunches as $trx) {

            // Convert biometric punch timestamp into HH:MM:SS format.
            $punchTime = Carbon::parse($trx->punch_time)->format('H:i:s');

            // Determine whether this punch is IN or OUT.
            $type = $this->resolvePunchType($trx);

            $punch = Carbon::parse($punchTime);

            /******************************************************************
             * STEP 1
             * Assign TIME IN
             ******************************************************************/
            if ($type === 'IN' && !$timeInAssigned) {

                // Normal morning arrival
                if (
                    $punch->between(
                        Carbon::parse('03:00:00'),
                        Carbon::parse('11:59:59')
                    )
                ) {

                    $dtr->timeIn = $punchTime;
                    $timeInAssigned = true;

                    continue;
                }

                // Afternoon-only employee.
                // Treat first afternoon punch as Break In.
                if ($punch->gte(Carbon::parse('12:00:00'))) {

                    $dtr->breakIn = $punchTime;
                    $breakInAssigned = true;

                    continue;
                }
            }

            /******************************************************************
             * STEP 2
             * Process Lunch Break
             *
             * Lunch is only valid when the employee actually
             * timed in during the morning.
             ******************************************************************/
            if ($type === 'IN' && $timeInAssigned) {

                if (
                    $punch->between(
                        Carbon::parse('12:00:00'),
                        Carbon::parse('13:00:59')
                    )
                ) {

                    /**
                     * First lunch punch
                     * -> Break Out
                     */
                    if (!$breakOutAssigned) {

                        $dtr->breakOut = $punchTime;
                        $breakOutAssigned = true;

                        continue;
                    }

                    /**
                     * Second lunch punch
                     * -> Break In
                     */
                    if (!$breakInAssigned) {

                        $dtr->breakIn = $punchTime;
                        $breakInAssigned = true;

                        continue;
                    }
                }
            }

            /******************************************************************
             * STEP 3
             * Assign Time Out
             *
             * Keep replacing Time Out.
             * The last OUT punch of the day becomes
             * the official Time Out.
             ******************************************************************/
            if ($type === 'OUT') {
                $dtr->timeOut = $punchTime;
            }
        }
    }

    private function processWeekendPunches(Dtr $dtr, $dayPunches): void
    {
        // Nothing to process.
        if ($dayPunches->isEmpty()) {
            return;
        }

        // First and last punches of the day.
        $firstPunch = Carbon::parse($dayPunches->first()->punch_time);
        $lastPunch  = Carbon::parse($dayPunches->last()->punch_time);

        $breakOutAssigned = false;
        $breakInAssigned  = false;

        /**
         * -------------------------------------------------------------
         * STEP 1
         * Determine whether the employee started
         * in the morning or afternoon.
         * -------------------------------------------------------------
         */
        if ($firstPunch->hour < 13) {

            // Morning schedule.
            $dtr->timeIn = $firstPunch->format('H:i:s');
        } else {

            // Afternoon only.
            $dtr->timeIn   = null;
            $dtr->breakOut = null;
            $dtr->breakIn  = $firstPunch->format('H:i:s');

            $breakInAssigned = true;
        }

        /**
         * -------------------------------------------------------------
         * STEP 2
         * Process remaining punches.
         * -------------------------------------------------------------
         */
        foreach ($dayPunches as $trx) {

            $currentPunch = Carbon::parse($trx->punch_time);

            // Skip the first punch.
            if ($currentPunch->equalTo($firstPunch)) {
                continue;
            }

            /**
             * ---------------------------------------------------------
             * BREAK OUT
             *
             * Only if there is a valid Time In.
             * ---------------------------------------------------------
             */
            if (
                $dtr->timeIn &&
                !$breakOutAssigned &&
                $currentPunch->hour < 13
            ) {

                $dtr->breakOut = $currentPunch->format('H:i:s');

                $breakOutAssigned = true;

                continue;
            }
            /**
             * ---------------------------------------------------------
             * BREAK IN
             *
             * First punch at or after 1PM.
             * ---------------------------------------------------------
             */
            if (
                !$breakInAssigned &&
                $currentPunch->hour >= 13
            ) {

                $dtr->breakIn = $currentPunch->format('H:i:s');

                $breakInAssigned = true;
            }
        }

        /**
         * -------------------------------------------------------------
         * STEP 3
         * Last punch is always Time Out.
         * -------------------------------------------------------------
         */
        $dtr->timeOut = $lastPunch->format('H:i:s');

        /**
         * -------------------------------------------------------------
         * STEP 4
         * Leave missing break values as NULL.
         * -------------------------------------------------------------
         */
        if (!$breakOutAssigned) {
            $dtr->breakOut = null;
        }

        if (!$breakInAssigned && $dtr->timeIn) {
            $dtr->breakIn = null;
        }
    }
}
