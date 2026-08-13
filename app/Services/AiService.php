<?php

namespace App\Services;

use App\AI\AttendanceAI;
use Illuminate\Support\Facades\Auth;
use App\Models\PersonnelEmployee;

class AiService
{
    public function __construct(
        protected AttendanceAI $attendanceAI,
        protected OpenAiService $openAi,
    ) {}


    public function ask(string $message)
    {
        $employee = PersonnelEmployee::where(
            'employee_id',
            Auth::user()->employee_id
        )->firstOrFail();

        $intent = $this->detectIntent($message);

        $prompt = match ($intent) {

            'attendance' => $this->attendanceAI->ask($employee, $message),

            default => "You are an HR assistant.",
        };

        return $this->openAi->ask($prompt);
    }

    private function detectIntent(string $message): string
    {
        $message = strtolower($message);

        // Attendance
        if (
            str_contains($message, 'attendance') ||
            str_contains($message, 'dtr') ||
            str_contains($message, 'time in') ||
            str_contains($message, 'time out') ||
            str_contains($message, 'late') ||
            str_contains($message, 'tardiness') ||
            str_contains($message, 'undertime') ||
            str_contains($message, 'overtime') ||
            str_contains($message, 'ot')
        ) {
            return 'attendance';
        }

        // Leave
        if (
            str_contains($message, 'leave') ||
            str_contains($message, 'vacation') ||
            str_contains($message, 'sick') ||
            str_contains($message, 'vl') ||
            str_contains($message, 'sl')
        ) {
            return 'leave';
        }

        // Employee
        if (
            str_contains($message, 'employee') ||
            str_contains($message, 'profile') ||
            str_contains($message, 'department')
        ) {
            return 'employee';
        }

        return 'unknown';
    }
}
