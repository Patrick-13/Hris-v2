<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class exportPayroll extends Controller
{
    public function exportPayrollPdf($id)
    {
        $payroll = Payroll::with('employeeBy', 'deductions')->findOrFail($id);

        $employee = $payroll->employeeBy;
        $employee_name = "{$employee->lastname}, {$employee->firstname} {$employee->middlename}";

        $position = $employee->position->name ?? 'N/A';
        $contract_duration = 'JANUARY - JUNE 2026';
        $payroll_period = Carbon::parse($payroll->payroll_from)->format('F d') .
            ' - ' . Carbon::parse($payroll->payroll_to)->format('d, Y');

        $underpayment = $payroll->days_absent * $payroll->daily_rate;

        // Deduction breakdown
        $deductions = $payroll->deductions->mapWithKeys(function ($item) {
            return [$item->type => $item->amount];
        })->toArray();

        // Gross earned = basic pay + premium
        $gross_earned = $payroll->basic_pay + $payroll->premium;


        $data = [
            'employee_name' => $employee_name,
            'position' => $position,
            'contract_duration' => $contract_duration,
            'payroll_period' => $payroll_period,
            'monthly_rate' => $payroll->monthly_rate,
            'days_worked' => $payroll->days_worked,
            'basic_pay' => $payroll->basic_pay,
            'premium' => $payroll->premium,
            'underpayment' => $underpayment,
            'late_deduction' => $payroll->total_late_hours * ($payroll->daily_rate / 8),
            'gross_earned' => $gross_earned,
            'deductions' => $deductions,
            'total_deductions' => $payroll->total_deductions,
            'net_pay' => $payroll->net_pay,
        ];

        $pdf = Pdf::loadView('pdf.payroll', $data)
            ->setPaper('legal', 'portrait');

        return $pdf->download('Payroll_' . str_replace(' ', '_', $employee_name) . '.pdf');
    }
}
