<?php

namespace App\Services\Dtr;

use App\Models\Dtr;
use App\Services\DtrFlexiScheduleService;

class DtrCalculationService
{
    public function __construct(
        protected DtrFlexiScheduleService $flexi
    ) {}

    public function calculate(Dtr $dtr): Dtr
    {
        $dtr->tardiness = $this->calculateTardiness($dtr);
        $dtr->undertime = $this->calculateUndertime($dtr);
        $dtr->overtime  = $this->calculateOvertime($dtr);

        $dtr->save();

        return $dtr;
    }

    private function calculateTardiness(Dtr $dtr): string
    {
        if (!$dtr->timeIn) {
            return '00:00:00';
        }

        return $this->flexi->tardiness($dtr);
    }

    private function calculateUndertime(Dtr $dtr): string
    {
        if (!$dtr->timeOut) {
            return '00:00:00';
        }

        return $this->flexi->undertime($dtr);
    }

    private function calculateOvertime(Dtr $dtr): string
    {
        if (!$dtr->timeOut) {
            return '00:00:00';
        }

        return $this->flexi->overtime($dtr);
    }
}
