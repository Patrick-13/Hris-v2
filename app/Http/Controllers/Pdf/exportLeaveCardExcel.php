<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\LeaveCreditLog;
use App\Models\PersonnelLeave;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class exportLeaveCardExcel extends Controller
{
    public function exportLeaveCardExcel(Request $request)
    {

        $employeeId = $request['search'];
        $currentYear = now()->year;
        $previousYear = $currentYear - 1;

        // Get all leave credit logs for the employee
        $leaveCreditLogs = LeaveCreditLog::where('employee_id', $employeeId)->get();

        $lastBalancesyear = LeaveCreditLog::where('employee_id', $employeeId)
            ->where('year', $previousYear)
            ->get()
            ->groupBy('leave_type_id')
            ->map(function ($logs) {
                return $logs
                    ->sortByDesc('month')
                    ->first()
                    ->after_balance;
            });

        $lastBalanceslatest = LeaveCreditLog::where('employee_id', $employeeId)
            ->get()
            ->groupBy('leave_type_id')
            ->map(function ($logs) {
                return $logs
                    ->sortByDesc(function ($log) {
                        return $log->year * 100 + $log->month;
                    })
                    ->first()
                    ->after_balance;
            });

        $afterBalances = LeaveCreditLog::where('employee_id', $employeeId)
            ->selectRaw('leave_type_id, SUM(after_balance) as total_after_balance')
            ->groupBy('leave_type_id')
            ->pluck('total_after_balance', 'leave_type_id');

        $totalBalance = $afterBalances[1] + $afterBalances[2];

        $leaveSummary = PersonnelLeave::where('employee_id', $employeeId)
            ->whereYear('start_date', $currentYear)
            ->whereHas('approvals', function ($q) {
                $q->where('status', 'approved');
            })
            ->get()
            ->groupBy('leave_type_id')
            ->map(function ($leaves) {
                $days = [];

                foreach ($leaves as $leave) {
                    $date = $leave->start_date->copy();

                    while ($date->lte($leave->end_date)) {
                        $days[] = $date->day;
                        $date->addDay();
                    }
                }

                sort($days);

                return [
                    'count' => count($days),
                    'days'  => $days,
                ];
            });


        // Check if records exist
        if ($leaveCreditLogs->isEmpty()) {
            return response()->json([
                'error' => 'Employee record not found.'
            ], 404);
        }
        // Load the Excel template
        $templatePath = storage_path('app/Leave_Card.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getSheet(0);

        $employee = $leaveCreditLogs->first()->employee;

        // Employee name in A4
        $sheet->setCellValue(
            'A4',
            "{$employee->lastname}, {$employee->firstname}"
        );

        $sheet->setCellValue(
            'A21',
            'Leave Credit as of ' . Carbon::now()->format('F Y')
        );

        foreach ($leaveCreditLogs as $log) {
            $row = 7 + $log->month; // Jan=8, Feb=9, ..., Dec=19
            $seconds = round($log->late_hours * 3600);
            $hours = (int) floor($seconds / 3600);
            $minutes = (int) floor(($seconds % 3600) / 60);

            $parts = [];

            if (!($hours === 0 && $minutes === 0)) {
                $parts[] = "T/U = {$hours} hrs {$minutes} mins,";
            }

            // VL (example leave_type_id = 2)
            if (isset($leaveSummary[2])) {
                $parts[] = "VL - {$leaveSummary[2]['count']}(" .
                    implode(',', $leaveSummary[2]['days']) . "," . ")";
            }

            // Wellness Leave (example leave_type_id = 9)
            if (isset($leaveSummary[9])) {
                $parts[] = "WL - {$leaveSummary[9]['count']}(" .
                    implode(',', $leaveSummary[9]['days']) . "," . ")";
            }

            // CTO (example leave_type_id = 10)
            if (isset($leaveSummary[10])) {
                $parts[] = "CTO - {$leaveSummary[10]['count']}(" .
                    implode(',', $leaveSummary[10]['days']) . "," . ")";
            }

            $value = implode(' ', $parts);

            if ($log->leave_type_id === 1) {
                $sheet->setCellValue("B{$row}", $value);
                $sheet->setCellValue("C{$row}", $log->earned);
                $sheet->setCellValue("D{$row}", $log->late_equivalent_days ?? 0);
                $sheet->setCellValue("E7", $lastBalancesyear[1] ?? 0);
                $sheet->setCellValue("E" . ($row - 1), $log->before_balance);
                $sheet->setCellValue("E{$row}", $log->after_balance);
                $sheet->setCellValue("E21", $lastBalanceslatest[1] ?? 0);
            }
            if ($log->leave_type_id === 2) {
                $sheet->setCellValue("F{$row}", $value);
                $sheet->setCellValue("G{$row}", $log->earned);
                $sheet->setCellValue("H{$row}", $log->late_equivalent_days ?? 0);
                $sheet->setCellValue("I7", $lastBalancesyear[2] ?? 0);
                $sheet->setCellValue("I" . ($row - 1), $log->before_balance);
                $sheet->setCellValue("I{$row}", $log->after_balance);
                $sheet->setCellValue("I21", $lastBalanceslatest[2] ?? 0);
            }
            $sheet->setCellValue("K{$row}", $totalBalance);
            $sheet->setCellValue("K21", $totalBalance);
            $sheet->setCellValue(
                "K7",
                ($lastBalancesyear[1] ?? 0) + ($lastBalancesyear[2] ?? 0)
            );
        }

        // Save the filled file
        $outputFile = storage_path(
            'app/public/Leave_Card_' . $employee->employee_id . '_' . time() . '.xlsx'
        );

        $writer = new Xlsx($spreadsheet);
        $writer->save($outputFile);

        // Download and delete after sending
        return response()->download($outputFile)->deleteFileAfterSend(true);
    }
}
