<?php

namespace App\Services;

use App\DTOs\LeaveCreditData;
use App\Models\LeaveCredit;
use App\Models\LeaveCreditLog;
use App\Models\PersonnelEmployee;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use App\Services\DtrService;
use Carbon\Carbon;

class LeaveCreditService
{

    protected DtrService $dtrService;

    public function __construct(DtrService $dtrService)
    {
        $this->dtrService = $dtrService;
    }
    public function createLeaveCredit(LeaveCreditData $data): LeaveCredit
    {
        return LeaveCredit::create([
            'employee_id' => $data->employee_id,
            'leave_type_id' => $data->leave_type_id,
            'year' => $data->year,
            'entitled' => $data->entitled,
            'used' => $data->used ?? 0,
            'balance' => $data->balance,
        ]);
    }

    public function updateLeaveCredit(LeaveCreditData $data, int $id): LeaveCredit
    {
        $leavecredit = LeaveCredit::findOrFail($id);

        $leavecredit->update([
            'employee_id' => $data->employee_id,
            'leave_type_id' => $data->leave_type_id,
            'year' => $data->year,
            'entitled' => $data->entitled,
            'used' => $data->used ?? 0,
            'balance' => $data->balance,
        ]);

        return $leavecredit;
    }

    public function addMonthlyLeaveCredits()
    {

        // Define your leave type IDs directly
        $vacationLeaveId = 1; // Vacation Leave
        $sickLeaveId = 2;     // Sick Leave

        // Get only employees whose job status is "Regular"
        $regularEmployees = PersonnelEmployee::where('employment_status', 'Regular')->get();

        // Loop through regular employees and update both leave credits
        foreach ($regularEmployees as $employee) {

            foreach ([$vacationLeaveId, $sickLeaveId] as $leaveTypeId) {

                $credit = $this->dtrService->calculateMonthlyLeaveCredit(
                    $employee->employee_id,
                    $leaveTypeId
                );

                $alreadyProcessed = LeaveCreditLog::where([
                    'employee_id'   => $employee->employee_id,
                    'leave_type_id' => $leaveTypeId,
                    'year'          => $credit['year'],
                    'month'         => $credit['month'],
                ])->exists();

                if ($alreadyProcessed) {
                    continue;
                }

                $leaveCredit = LeaveCredit::where('employee_id', $employee->employee_id)
                    ->where('leave_type_id', $leaveTypeId)
                    ->where('year', now()->year)
                    ->first();

                if (!$leaveCredit) {
                    continue;
                }

                $beforeBalance = $leaveCredit->balance;


                $leaveCredit->entitled += $credit['earned'];
                $leaveCredit->balance += $credit['earned'];
                $leaveCredit->save();

                LeaveCreditLog::create([
                    'employee_id'        => $employee->employee_id,
                    'leave_type_id'      => $leaveTypeId,
                    'year'               => $credit['year'],
                    'month'              => $credit['month'],

                    'earned'             => $credit['earned'],

                    'before_balance'     => $beforeBalance,
                    'after_balance'      => $leaveCredit->balance,

                    'absent_days'        => $credit['absent'],
                    'half_days'          => $credit['half_day'],

                    'tardiness_hours'    => $credit['tardiness_hours'],
                    'undertime_hours'    => $credit['undertime_hours'],
                    'late_hours'         => $credit['late_hours'],
                    'late_equivalent_days' => $credit['late_equivalent'],

                    'remarks'               => $credit['remarks'],
                ]);

                Log::info("Leave credit updated for {$employee->employee_id} (Leave Type {$leaveTypeId})");
            }
        }

        Log::info("Monthly leave credit process completed.");;
    }

    public function importLeaveCredits(UploadedFile $file): array
    {
        $filepath = $file->getRealPath();
        $data = array_map('str_getcsv', file($filepath));

        $leaveCredits = [];

        $imported = 0;
        $skipped = 0;
        $notFoundEmployees = [];


        foreach ($data as $rowIndex => $row) {

            if ($rowIndex === 0) continue;

            if (count($row) < 5) {
                $skipped++;
                continue;
            }

            $employeeId = $row[1] ?? null;
            $vacationLeave = isset($row[3]) && is_numeric($row[3]) ? (float)$row[3] : 0;
            $sickLeave = isset($row[4]) && is_numeric($row[4]) ? (float)$row[4] : 0;
            $year = now()->year;

            // Ignore empty employee_id
            if (!$employeeId) {
                $skipped++;
                continue;
            }

            // Validate if employee exists
            $employeeExists = PersonnelEmployee::where('employee_id', $employeeId)->exists();

            if (!$employeeExists) {
                $notFoundEmployees[] = $employeeId;
                $skipped++;
                continue;
            }

            // Vacation Leave
            $leaveCredits[] = [
                'employee_id' => $employeeId,
                'leave_type_id' => 1,
                'year' => $year,
                'entitled' => $vacationLeave,
                'used' => 0,
                'balance' => $vacationLeave,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Sick Leave
            $leaveCredits[] = [
                'employee_id' => $employeeId,
                'leave_type_id' => 2,
                'year' => $year,
                'entitled' => $sickLeave,
                'used' => 0,
                'balance' => $sickLeave,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $imported++;
        }

        if (!empty($leaveCredits)) {
            LeaveCredit::upsert(
                $leaveCredits,
                ['employee_id', 'leave_type_id', 'year'],
                [
                    'entitled',
                    'used',
                    'balance',
                    'updated_at'
                ]
            );
        }

        return [
            'imported' => $imported,
            'skipped' => $skipped,
            'not_found' => $notFoundEmployees
        ];
    }
}
