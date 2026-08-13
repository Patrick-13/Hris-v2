<?php

namespace App\Services\DtrCalnderService;

use App\Models\Dtr;
use App\Models\PersonnelEmployee;
use Carbon\Carbon;

class DtrDayContext
{
    public function __construct(
        public Carbon $date,
        public PersonnelEmployee $employee,
        public ?Dtr $dtr = null,
        public $leave = null,
        public $activity = null,
        public $training = null,
        public $travel = null,
        public $memo = null,
        public $tko = null,
        public $holiday = null,
    ) {}

    public function hasDtr(): bool
    {
        return $this->dtr !== null;
    }

    public function isWeekend(): bool
    {
        return $this->date->isSaturday()
            || $this->date->isSunday();
    }

    public function isFriday(): bool
    {
        return $this->date->isFriday();
    }

    public function isExcused(): bool
    {
        return (bool) (
            $this->leave ||
            $this->travel ||
            $this->activity ||
            $this->training ||
            $this->memo ||
            $this->tko
        );
    }
}
