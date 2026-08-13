<?php

namespace App\Services;

use App\DTOs\ActivityData;
use App\Models\Activity;
use App\Models\LeaveCredit;
use App\Models\LeaveCreditLog;
use Carbon\Carbon;
use Illuminate\Notifications\Action;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ActivityService
{
    public function createActivity(ActivityData $data): Activity
    {
        return DB::transaction(function () use ($data) {

            $activity = Activity::create([
                'title_id'    => $data->title_id,
                'soNumber'    => $data->soNumber,
                'dateFrom'    => $data->dateFrom,
                'dateTo'      => $data->dateTo,
                'noofHours'   => $data->noofHours,
                'type'        => $data->type,
                'venue'       => $data->venue,
                'description' => $data->description,
                'with_coc'    => $data->with_coc,
            ]);

            if (!empty($data->employees)) {
                $activity->employees()->attach($data->employees);

                // Reload employees so the relationship is available
                $activity->load('employees');

                if ($activity->with_coc) {
                    $this->grantCompensatoryLeaveCredits($activity);
                }
            }

            return $activity;
        });
    }
    public function getId(int $id): Activity
    {
        return Activity::findOrFail($id);
    }
    public function getIdwithEmployees(int $id): Activity
    {
        return Activity::with('employees')->findOrFail($id);
    }

    public function updateActivity(ActivityData $data, int $id): Activity
    {
        return DB::transaction(function () use ($data, $id) {

            $activity = Activity::with('employees')->findOrFail($id);

            // Save original values
            $oldEmployeeIds = $activity->employees->pluck('employee_id')->toArray();
            $oldWithCoc     = $activity->with_coc;
            $oldHours       = $activity->noofHours;
            $oldDateFrom    = $activity->dateFrom;

            // Update activity
            $activity->update([
                'title_id'    => $data->title_id,
                'soNumber'    => $data->soNumber,
                'dateFrom'    => $data->dateFrom,
                'dateTo'      => $data->dateTo,
                'noofHours'   => $data->noofHours,
                'type'        => $data->type,
                'venue'       => $data->venue,
                'description' => $data->description,
                'with_coc'    => $data->with_coc,
            ]);

            // Sync employees
            if (!empty($data->employees)) {
                $activity->employees()->sync($data->employees);
            } else {
                $activity->employees()->detach();
            }

            // Reload employees
            $activity->load('employees');

            $newEmployeeIds = $activity->employees->pluck('employee_id')->toArray();

            // Compare employee lists
            $addedEmployees   = array_values(array_diff($newEmployeeIds, $oldEmployeeIds));
            $removedEmployees = array_values(array_diff($oldEmployeeIds, $newEmployeeIds));


            if (!empty($addedEmployees)) {
                $this->grantCompensatoryLeaveCredits($activity, $addedEmployees);
            }

            if (!empty($removedEmployees)) {
                $this->deductCompensatoryLeaveCredits($activity, $removedEmployees);
            }


            return $activity;
        });
    }
    private function grantCompensatoryLeaveCredits(Activity $activity, array $employeeIds = [])
    {
        try {

            $compensatoryLeaveId = 10;
            $ratePerHour = 1.25 / 10;

            $hours = (float) $activity->noofHours;

            $activityDate = Carbon::parse($activity->dateFrom);

            if (
                $activityDate->isFriday() ||
                $activityDate->isSaturday() ||
                $activityDate->isSunday()
            ) {
                $hours *= 1.5;
            }

            $creditsToAdd = $hours * $ratePerHour;

            $employees = empty($employeeIds)
                ? $activity->employees()->get()
                : $activity->employees()
                ->whereIn('personnel_employees.employee_id', $employeeIds)
                ->get();


            foreach ($employees as $employee) {

                // ✅ FIRST check if this employee already received COC for this activity
                $exists = LeaveCreditLog::where('activity_id', $activity->id)
                    ->where('employee_id', $employee->employee_id)
                    ->where('leave_type_id', $compensatoryLeaveId)
                    ->where('action', 'grant')
                    ->exists();

                if ($exists) {
                    Log::info("COC already granted to {$employee->employee_id}. Skipping...");
                    continue;
                }

                // Only NEW employees reach this point
                $leaveCredit = LeaveCredit::firstOrCreate(
                    [
                        'employee_id'   => $employee->employee_id,
                        'leave_type_id' => $compensatoryLeaveId,
                        'year'          => $activityDate->year,
                    ],
                    [
                        'entitled' => 0,
                        'balance'  => 0,
                    ]
                );

                $beforeBalance = $leaveCredit->balance;

                $leaveCredit->entitled += $creditsToAdd;
                $leaveCredit->balance += $creditsToAdd;
                $leaveCredit->save();

                LeaveCreditLog::create([
                    'activity_id'    => $activity->id,
                    'employee_id'    => $employee->employee_id,
                    'leave_type_id'  => $compensatoryLeaveId,

                    'year'           => $activityDate->year,
                    'month'          => $activityDate->month,

                    'earned'         => $creditsToAdd,
                    'credits'        => $creditsToAdd,
                    'action'         => 'grant',

                    'before_balance' => $beforeBalance,
                    'after_balance'  => $leaveCredit->balance,

                    'remarks'        => "COC granted for Activity S.O #{$activity->soNumber}",
                ]);

                Log::info("Granted {$creditsToAdd} COC to {$employee->employee_id}");
            }
        } catch (\Exception $e) {

            Log::error($e->getMessage());

            throw $e;
        }
    }

    private function deductCompensatoryLeaveCredits(Activity $activity, array $employeeIds = [])
    {
        $logs = LeaveCreditLog::where('activity_id', $activity->id)
            ->where('action', 'grant')
            ->when(!empty($employeeIds), function ($query) use ($employeeIds) {
                $query->whereIn('employee_id', $employeeIds);
            })
            ->get();

        foreach ($logs as $log) {

            $leaveCredit = LeaveCredit::where('employee_id', $log->employee_id)
                ->where('leave_type_id', $log->leave_type_id)
                ->where('year', $log->year)
                ->first();

            if (!$leaveCredit) {
                continue;
            }

            $beforeBalance = $leaveCredit->balance;

            $leaveCredit->entitled -= $log->credits;
            $leaveCredit->balance  -= $log->credits;

            if ($leaveCredit->entitled < 0) {
                $leaveCredit->entitled = 0;
            }

            if ($leaveCredit->balance < 0) {
                $leaveCredit->balance = 0;
            }

            $leaveCredit->save();

            $log->update([
                'activity_id'    => $activity->id,
                'employee_id'    => $log->employee_id,
                'leave_type_id'  => $log->leave_type_id,

                'year'           => $log->year,
                'month'          => $log->month,

                'earned'         => -$log->credits,
                'credits'        => -$log->credits,
                'action'         => 'deduct',

                'before_balance' => $beforeBalance,
                'after_balance'  => $leaveCredit->balance,

                'remarks'        => 'COC Deducted due to activity update',
            ]);

            // Remove only this employee's grant log
            $log->delete();
        }
    }
}
