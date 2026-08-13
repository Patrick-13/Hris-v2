<?php

namespace App\AI;

use App\Models\Dtr;
use App\Models\PersonnelEmployee;
use App\Services\OpenAiService;
use Carbon\Carbon;
use Carbon\CarbonInterval;

class AttendanceAI
{
    public function __construct(
        protected OpenAiService $openAi
    ) {}

    /**
     * Main entry point for attendance questions.
     */
    public function ask(PersonnelEmployee $employee, string $message): string
    {
        $question = strtolower($message);

        if (
            str_contains($question, 'yesterday') ||
            str_contains($question, 'today')
        ) {
            return $this->dailyAttendance($employee, $message);
        }

        if (
            str_contains($question, 'overtime') ||
            str_contains($question, 'ot')
        ) {
            return $this->overtimeSummary($employee, $message);
        }

        if (
            str_contains($question, 'late') ||
            str_contains($question, 'tardiness')
        ) {
            return $this->lateSummary($employee, $message);
        }

        return $this->monthlySummary($employee, $message);
    }

    /**
     * Monthly attendance summary.
     */
    private function monthlySummary(PersonnelEmployee $employee, string $message): string
    {
        $dtrs = Dtr::where('employee_id', $employee->employee_id)
            ->whereMonth('punch_date', now()->month)
            ->whereYear('punch_date', now()->year)
            ->get();

        $workingDays = $dtrs->count();

        $lateDays = $dtrs->filter(function ($dtr) {
            return !empty($dtr->tardiness)
                && $dtr->tardiness !== '00:00:00';
        })->count();

        $lateMinutes = $this->sumMinutes($dtrs, 'tardiness');

        $undertimeMinutes = $this->sumMinutes($dtrs, 'undertime');

        $overtimeHours = $this->sumHours($dtrs, 'overtime');

        return "
You are an HR Attendance Assistant.

Employee:
{$employee->firstname} {$employee->lastname}

Monthly Attendance

Working Days: {$workingDays}

Late Occurrences: {$lateDays}

Total Tardiness: {$lateMinutes} minutes

Total Undertime: {$undertimeMinutes} minutes

Total Overtime: {$overtimeHours} hours

User Question:
{$message}

Answer only using the attendance information above.
";
    }

    /**
     * Lateness summary.
     */
    private function lateSummary(PersonnelEmployee $employee, string $message): string
    {
        $dtrs = Dtr::where('employee_id', $employee->employee_id)
            ->whereMonth('punch_date', now()->month)
            ->whereYear('punch_date', now()->year)
            ->where('tardiness', '>', 0)
            ->get();

        $lateDays = $dtrs->count();
        $lateMinutes = $this->sumMinutes($dtrs, 'tardiness');

        $prompt = "
You are an HR Attendance Assistant.

Employee:
{$employee->firstname} {$employee->lastname}

Late Occurrences:
{$lateDays}

Total Tardiness:
{$lateMinutes} minutes

User Question:
{$message}

Answer professionally.
";

        return $this->openAi->ask($prompt);
    }

    /**
     * Overtime summary.
     */
    private function overtimeSummary(PersonnelEmployee $employee, string $message): string
    {
        $overtimeHours = Dtr::where('employee_id', $employee->employee_id)
            ->whereMonth('punch_date', now()->month)
            ->whereYear('punch_date', now()->year)
            ->sum('overtime');

        $prompt = "
You are an HR Attendance Assistant.

Employee:
{$employee->firstname} {$employee->lastname}

Total Overtime:
{$overtimeHours} hours

User Question:
{$message}

Answer professionally.
";

        return $this->openAi->ask($prompt);
    }

    /**
     * Daily attendance.
     */
    private function dailyAttendance(PersonnelEmployee $employee, string $message): string
    {
        $date = str_contains(strtolower($message), 'yesterday')
            ? Carbon::yesterday()
            : Carbon::today();

        $dtr = Dtr::where('employee_id', $employee->employee_id)
            ->whereDate('punch_date', $date)
            ->first();

        if (!$dtr) {
            return "No attendance record was found for {$date->toFormattedDateString()}.";
        }

        $prompt = "
You are an HR Attendance Assistant.

Employee:
{$employee->firstname} {$employee->lastname}

Attendance Record

Date:
{$dtr->punch_date}

Time In:
{$dtr->timein}

Time Out:
{$dtr->timeout}

Tardiness:
{$dtr->tardiness}

Undertime:
{$dtr->undertime}

Overtime:
{$dtr->overtime}

Remarks:
{$dtr->remarks}

User Question:
{$message}

Answer only using the attendance record above.
";

        return $this->openAi->ask($prompt);
    }

    private function sumMinutes($collection, string $field): int
    {
        return $collection->sum(function ($row) use ($field) {

            if (empty($row->$field) || $row->$field === '00:00:00') {
                return 0;
            }

            return CarbonInterval::createFromFormat('H:i:s', $row->$field)
                ->totalMinutes;
        });
    }

    private function sumHours($collection, string $field): float
    {
        return round(
            $collection->sum(function ($row) use ($field) {

                if (empty($row->$field) || $row->$field === '00:00:00') {
                    return 0;
                }

                return CarbonInterval::createFromFormat('H:i:s', $row->$field)
                    ->totalSeconds / 3600;
            }),
            2
        );
    }
}
