<?php

namespace App\Services\Dtr;

use App\DTOs\DtrContext;
use Carbon\Carbon;

class DtrStatusResolver
{
    public function resolve(
        Carbon $date,
        DtrContext $context
    ): array {
        $employee = $context->employee;

        // 0. FWA-B
        if (
            $employee->flexi_type === 'FWA-B' &&
            $date->isFriday()
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'FWA-B',
            ];
        }

        // 1. Holiday
        if (
            $holiday = $this->matchHoliday(
                $context->holidays,
                $date
            )
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'HOLIDAY',
                'holiday_name' => $holiday->name,
            ];
        }

        // 2. Leave
        if (
            $leave = $this->matchRange(
                $context->leaves,
                $date,
                'start_date',
                'end_date'
            )
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'LEAVE',
                'leave' => $leave,
            ];
        }

        // 3. Travel
        if (
            $travel = $this->matchRange(
                $context->travelOrders,
                $date,
                'travel_departure_date',
                'travel_return_date'
            )
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'TRAVEL',
                'travel' => $travel,
            ];
        }

        // 4. Activity
        if (
            $activity = $this->matchRange(
                $context->activities,
                $date,
                'dateFrom',
                'dateTo'
            )
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'ACTIVITY',
                'activity' => $activity,
            ];
        }

        // 5. Training
        if (
            $training = $this->matchRange(
                $context->trainings,
                $date,
                'dateFrom',
                'dateTo'
            )
        ) {
            return [
                'date' => $date->toDateString(),
                'status' => 'TRAINING',
                'training' => $training,
            ];
        }

        // 6. Weekend
        if ($date->isWeekend()) {
            return [
                'date' => $date->toDateString(),
                'status' => 'WEEKEND',
            ];
        }

        // 7. DTR
        return $this->resolveDtrStatus(
            $context->dtrs,
            $date->toDateString()
        );
    }

    private function matchRange(
        $collection,
        Carbon $date,
        string $startField,
        string $endField
    ) {
        return $collection->first(
            function ($item) use (
                $date,
                $startField,
                $endField
            ) {
                $start = Carbon::parse(
                    $item->$startField
                )->startOfDay();

                $end = Carbon::parse(
                    $item->$endField
                )->endOfDay();

                return $date->between($start, $end);
            }
        );
    }

    private function resolveDtrStatus(
        $dtrs,
        string $dateStr
    ): array {
        $dtr = $dtrs[$dateStr] ?? null;

        if (!$dtr) {
            return [
                'date' => $dateStr,
                'status' => 'ABSENT',
            ];
        }

        $isHalfDay =
            (empty($dtr->timeIn) &&
                empty($dtr->breakOut))
            ||
            (empty($dtr->breakIn) &&
                empty($dtr->timeOut));

        return [
            'date' => $dateStr,
            'status' => $isHalfDay
                ? 'HALF-DAY'
                : 'PRESENT',
            'dtr' => $dtr,
        ];
    }

    private function matchHoliday(
        $holidays,
        Carbon $date
    ) {
        return $holidays->first(
            function ($holiday) use ($date) {
                return Carbon::parse(
                    $holiday->holiday_date
                )->format('Y-m-d') ===
                    $date->format('Y-m-d');
            }
        );
    }
}