<?php

namespace App\Services;

use App\Models\PersonnelEmployee;
use App\Models\Payroll;
use App\Models\Payroll_deduction;
use App\Models\PayrollDeduction;
use App\Services\DtrService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Validation\ValidationException;

class PayrollService
{
    protected $dtrService;

    public function __construct(DtrService $dtrService)
    {
        $this->dtrService = $dtrService;
    }

    public function generatePayroll($dateFrom, $dateTo, $status)
    {
        return DB::transaction(function () use ($dateFrom, $dateTo, $status) {

            // $existingPayroll = Payroll::where('employee_id', $employeeId)
            //     ->whereDate('payroll_from', $dateFrom)
            //     ->whereDate('payroll_to', $dateTo)
            //     ->exists();

            // if ($existingPayroll) {
            //     throw ValidationException::withMessages([
            //         'payroll' => ['Payroll already generated for this employee and date range.']
            //     ]);
            // }

            // 1️⃣ Get Employee
            $employees = PersonnelEmployee::where('employment_status', $status)
                ->whereNotNull('daily_rate')
                ->with('deductions')
                ->get();

            $generatedPayroll = [];

            foreach ($employees as $employee) {

                $employeeId = $employee->employee_id;

                // Skip if payroll already exists
                $existingPayroll = Payroll::where('employee_id', $employeeId)
                    ->whereDate('payroll_from', $dateFrom)
                    ->whereDate('payroll_to', $dateTo)
                    ->exists();

                if ($existingPayroll) {
                    continue;
                }

                $generatedPayroll[] = $this->generateSinglePayroll(
                    $employee,
                    $dateFrom,
                    $dateTo
                );
            }

            return $generatedPayroll;
        });
    }

    private function generateSinglePayroll($employee, $dateFrom, $dateTo)
    {
        $employeeId = $employee->employee_id;

        $dtrRecords = $this->dtrService->buildEmployeeDtr($employeeId, $dateFrom, $dateTo);
        // dd($dtrRecords);
        $daysWorked = 0;
        $absentDays = 0;
        $halfDays = 0;

        $tardinessSeconds = 0;
        $undertimeSeconds = 0;

        foreach ($dtrRecords as $day) {
            $dayOfWeek = \Carbon\Carbon::parse($day['date'])->format('D');
            $date = $day['date'] ?? null;
            $status = $day['status'] ?? null;

            if (!$status) continue;
            // $isWeekend = $status === 'WEEKEND';

            $isWeekend = in_array($dayOfWeek, ['Fri', 'Sat', 'Sun']);

            // ================================
            // WORK CONTEXT
            // ================================
            $hasWorkContext =
                !empty($day['dtr']) ||
                !empty($day['travel_id']) ||
                !empty($day['soNumber']) ||
                !empty($day['title']) ||
                !empty($day['activity']) ||
                !empty($day['leave_id']) ||
                !empty($day['holiday_name']) ||
                !empty($day['memo']);

            // ================================
            // WEEKEND → IGNORE
            // ================================
            if ($isWeekend) {
                continue;
            }

            // ================================
            // MEMO / NO WORK → PAID
            // ================================
            if ($status === 'NO WORK' && !empty($day['memo'])) {
                $daysWorked += 1;
                continue;
            }

            // ================================
            // ABSENT
            // ================================
            if ($status === 'ABSENT') {
                if ($hasWorkContext) {
                    $daysWorked += 1; // override absence
                } else {
                    $absentDays += 1;
                }
                continue;
            }

            // ================================
            // HALF DAY
            // ================================
            if ($status === 'HALF-DAY') {
                $daysWorked += 0.5;
                $absentDays += 0.5;
                continue;
            }

            // ================================
            // WORK / PRESENT / CONTEXT DAYS
            // ================================
            if ($hasWorkContext) {
                $daysWorked += 1;
            }

            // ================================
            // TARDINESS / UNDERTIME
            // ================================
            if ($status === 'PRESENT' && !empty($day['dtr'])) {

                $tardinessSeconds += timeStringToSeconds($day['dtr']->tardiness ?? '0:0');
                $undertimeSeconds += timeStringToSeconds($day['dtr']->undertime ?? '0:0');
            }
        }

        // =====================================================
        // 🟢 FIX: FORCE 11-DAY CUT-OFF RULE (YOUR REQUIREMENT)
        // =====================================================
        $totalCutoffDays = 11;

        $totalAccounted = $daysWorked + $absentDays + $halfDays;

        if ($totalAccounted < $totalCutoffDays) {
            $daysWorked += ($totalCutoffDays - $totalAccounted);
        }

        // ================================
        // COMPUTATION
        // ================================
        $dailyRate = round($employee->daily_rate / 22, 2);
        $hourlyRate = round($dailyRate / 8, 2);

        $totalLateHours = round(($tardinessSeconds + $undertimeSeconds) / 3600, 2);
        $lateDeduction = round($totalLateHours * $hourlyRate, 2);

        $basicPay = round(($dailyRate * $daysWorked) - $lateDeduction, 2);

        $isFirstCutoff = (int) date('d', strtotime($dateFrom)) <= 15;

        $deductionData = $employee->deductions;

        $sss = $isFirstCutoff ? ($deductionData->sss ?? 0) : 0;
        $philhealth = $isFirstCutoff ? ($deductionData->philhealth ?? 0) : 0;
        $pagibig = $isFirstCutoff ? ($deductionData->pagibig ?? 0) : 0;
        $tax = $isFirstCutoff ? ($deductionData->tax ?? 0) : 0;
        $union = $isFirstCutoff ? ($deductionData->union_fee ?? 0) : 0;

        $totalDeductions = $sss + $philhealth + $pagibig + $tax + $union;

        $premium = round($employee->daily_rate * 0.10, 2) / 2;

        $netPay = $basicPay - $totalDeductions;

        return Payroll::create([
            'employee_id' => $employeeId,
            'payroll_from' => $dateFrom,
            'payroll_to' => $dateTo,
            'monthly_rate' => $employee->daily_rate,
            'daily_rate' => $dailyRate,
            'days_worked' => $daysWorked,
            'days_absent' => $absentDays,
            'total_late_hours' => $totalLateHours,
            'basic_pay' => $basicPay,
            'premium' => $premium,
            'total_deductions' => $totalDeductions,
            'net_pay' => $netPay,
            'status' => 'draft'
        ]);
    }
    public function updateStatus($payrollId, $status)
    {
        // ✅ Find the approval record
        $approval = Payroll::where('id', $payrollId)->firstOrFail();

        // ✅ Update approval status
        $approval->update([
            'status' => $status,
            'approved_at' => now(),
        ]);

        return true;
    }
}

function timeStringToSeconds($time)
{
    if (!$time) return 0;
    [$h, $m] = explode(':', $time);
    return ($h * 3600) + ($m * 60);
}
