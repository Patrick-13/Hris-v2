<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class exportPayrollFileExcel extends Controller
{
    public function exportPayrollExcel()
    {
        $status   = request('status');
        $dateFrom = request('date_from');
        $dateTo   = request('date_to');

        // Ensure dates are valid
        if ($dateFrom && $dateTo) {
            try {
                $dateFrom = Carbon::parse($dateFrom)->startOfDay()->toDateString();
                $dateTo   = Carbon::parse($dateTo)->endOfDay()->toDateString();
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid date format'], 400);
            }
        }

        $query = Payroll::with(['employeeBy', 'deductions']);

        // Filter by status if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Filter by payroll period if dates are provided
        if ($dateFrom && $dateTo) {
            $query->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('payroll_from', [$dateFrom, $dateTo])
                    ->orWhereBetween('payroll_to', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('payroll_from', '<=', $dateFrom)
                            ->where('payroll_to', '>=', $dateTo);
                    });
            });
        }

        $payrolls = $query->get();

        if ($payrolls->isEmpty()) {
            return response()->json(['error' => 'No payroll records found'], 404);
        }

        // Prepare payroll period text
        $firstPayroll = $payrolls->first();
        $from = Carbon::parse($firstPayroll->payroll_from)->format('M d');
        $to = Carbon::parse($firstPayroll->payroll_to)->format('d, Y');

        // Load Excel template
        $templatePath = storage_path('app/Regular_fund.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getActiveSheet();

        // Set payroll period in A3
        $sheet->setCellValue('A3', $from . ' - ' . $to);

        $groupedPayrolls = $payrolls->groupBy(function ($payroll) {
            return optional($payroll->employeeBy)->charging ?? 'Unknown';
        });



        foreach ($groupedPayrolls as $charging => $payrollGroup) {
            $chargingRowMap = [
                '00047' => 9,
                '00048' => 22,
                '00049' => 26,
                '00050' => 28,
                '00051' => 31,
                '00052' => 35,
                '00054' => 40,
                '00055' => 47,
                '00056' => 50,
                '00057' => 57,
                '00058' => 62,
                '00059' => 69,
            ];
            // Extract last 5 digits if your map uses those
            $chargingKey = substr($charging, -5);

            // Get start row from the map, default to 22 if not found
            $row = $chargingRowMap[$chargingKey] ?? 22;

            foreach ($payrollGroup as $payroll) {
                $employee = $payroll->employeeBy;
                $position = optional($employee->positionBy)->post_name;

                $ratePerMinute = $payroll->daily_rate / 8 / 60;
                $totalMinutes = $payroll->total_late_hours * 60;
                $lateDeduction = $ratePerMinute * $totalMinutes;

                // Employee info
                $sheet->setCellValue('C' . $row, optional($employee)->lastname . ', ' . optional($employee)->firstname);
                $sheet->setCellValue('D' . $row, optional($employee)->account_no);
                $sheet->setCellValue('E' . $row, $position);

                // Salary info
                $sheet->setCellValue('F' . $row, $payroll->monthly_rate * 6);
                $sheet->setCellValue('G' . $row, $payroll->monthly_rate);
                $sheet->setCellValue('H' . $row, $payroll->daily_rate);
                $sheet->setCellValue('I' . $row, $ratePerMinute);

                $sheet->setCellValue('J' . $row, $payroll->days_worked);
                $sheet->setCellValue('K' . $row, $payroll->days_absent);
                $sheet->setCellValue('L' . $row, $payroll->days_absent * $payroll->daily_rate);

                $sheet->setCellValue('M' . $row, $payroll->basic_pay);
                $sheet->setCellValue('N' . $row, $payroll->premium);
                $sheet->setCellValue('O' . $row, $payroll->basic_pay + $payroll->premium);

                $sheet->setCellValue('Q' . $row, $totalMinutes);
                $sheet->setCellValue('R' . $row, $lateDeduction);
                $sheet->setCellValue('U' . $row, $payroll->basic_pay + $payroll->premium);

                // Deductions
                $deductions = $payroll->deductions;
                $sheet->setCellValue('Y' . $row, optional($deductions->firstWhere('type', 'union_fee'))->amount ?? 0);
                $sheet->setCellValue('Z' . $row, optional($deductions->firstWhere('type', 'sss'))->amount ?? 0);
                $sheet->setCellValue('AA' . $row, optional($deductions->firstWhere('type', 'pagibig'))->amount ?? 0);
                $sheet->setCellValue('AB' . $row, optional($deductions->firstWhere('type', 'philhealth'))->amount ?? 0);
                $sheet->setCellValue('AC' . $row, optional($deductions->firstWhere('type', 'tax'))->amount ?? 0);

                // Totals
                $sheet->setCellValue('AE' . $row, $payroll->total_deductions);
                $sheet->setCellValue('AF' . $row, $payroll->net_pay);

                $row++; // move to next row for the next employee in the same charging group
            }
        }

        // Save and download
        $outputFile = storage_path('app/public/payroll_export.xlsx');
        $writer = new Xlsx($spreadsheet);
        $writer->save($outputFile);

        return response()->download($outputFile)->deleteFileAfterSend(true);
    }
}
