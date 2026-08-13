<?php

namespace App\Services\Dtr;

use App\Models\Dtr;
use App\Models\IclockTransaction;
use App\Services\DtrFlexiScheduleService;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DtrPunchService
{
    public function __construct(
        protected DtrFlexiScheduleService $flexi
    ) {}

    public function process(
        Dtr $dtr,
        Collection $punches
    ): void {
        $date = Carbon::parse(
            $punches->first()->punch_time
        );

        if ($this->isWeekend($date)) {
            $this->processWeekend($dtr, $punches);
            return;
        }

        $this->processWeekday($dtr, $punches);
    }

    private function isWeekend(Carbon $date): bool
    {
        return $date->isFriday()
            || $date->isSaturday()
            || $date->isSunday();
    }

    private function processWeekday(
        Dtr $dtr,
        Collection $punches
    ): void {
        $timeInAssigned = false;
        $breakOutAssigned = false;
        $breakInAssigned = false;

        foreach ($punches as $transaction) {
            $time = Carbon::parse($transaction->punch_time);
            $type = $this->resolveType($transaction);

            if (
                $type === 'IN' &&
                !$timeInAssigned &&
                $this->isMorning($time)
            ) {
                $dtr->timeIn = $time->format('H:i:s');
                $timeInAssigned = true;
                continue;
            }

            if (
                $type === 'IN' &&
                $timeInAssigned &&
                $this->isLunch($time)
            ) {
                if (!$breakOutAssigned) {
                    $dtr->breakOut = $time->format('H:i:s');
                    $breakOutAssigned = true;
                    continue;
                }

                if (!$breakInAssigned) {
                    $dtr->breakIn = $time->format('H:i:s');
                    $breakInAssigned = true;
                    continue;
                }
            }

            if ($type === 'OUT') {
                $dtr->timeOut = $time->format('H:i:s');
            }
        }

        // Afternoon-only punch
        if (!$timeInAssigned) {
            foreach ($punches as $transaction) {
                $time = Carbon::parse($transaction->punch_time);

                if (
                    $this->resolveType($transaction) === 'IN' &&
                    $time->hour >= 12
                ) {
                    $dtr->breakIn = $time->format('H:i:s');
                    break;
                }
            }
        }
    }

    private function processWeekend(
        Dtr $dtr,
        Collection $punches
    ): void {
        $first = Carbon::parse(
            $punches->first()->punch_time
        );

        $last = Carbon::parse(
            $punches->last()->punch_time
        );

        if ($first->hour < 13) {
            $dtr->timeIn = $first->format('H:i:s');
        } else {
            $dtr->timeIn = null;
            $dtr->breakOut = null;
            $dtr->breakIn = $first->format('H:i:s');
        }

        $this->assignWeekendBreaks(
            $dtr,
            $punches
        );

        $dtr->timeOut = $last->format('H:i:s');

        $dtr->tardiness = null;
        $dtr->undertime = null;
    }

    private function assignWeekendBreaks(
        Dtr $dtr,
        Collection $punches
    ): void {
        foreach ($punches->skip(1) as $transaction) {
            $time = Carbon::parse($transaction->punch_time);

            if (
                $dtr->timeIn &&
                !$dtr->breakOut &&
                $time->hour < 13
            ) {
                $dtr->breakOut = $time->format('H:i:s');
                continue;
            }

            if (
                !$dtr->breakIn &&
                $time->hour >= 13
            ) {
                $dtr->breakIn = $time->format('H:i:s');
            }
        }
    }

    private function resolveType(
        IclockTransaction $transaction
    ): string {
        $time = Carbon::parse($transaction->punch_time);

        if (
            $time->between(
                $time->copy()->setTime(5, 0),
                $time->copy()->setTime(11, 30)
            )
        ) {
            return 'IN';
        }

        if (
            $time->between(
                $time->copy()->setTime(13, 30),
                $time->copy()->setTime(23, 59)
            )
        ) {
            return 'OUT';
        }

        return $transaction->punch_state == 0
            ? 'IN'
            : 'OUT';
    }

    private function isMorning(Carbon $time): bool
    {
        return $time->hour >= 3 && $time->hour < 12;
    }

    private function isLunch(Carbon $time): bool
    {
        return $time->between(
            $time->copy()->setTime(12, 0),
            $time->copy()->setTime(13, 0, 59)
        );
    }
}
