<?php

namespace App\Repositories\Dtr;

use App\Models\Holiday;
use Carbon\Carbon;

class HolidayRepository
{
    public function getByRange($dateFrom, $dateTo)
    {
        return Holiday::whereBetween('holiday_date', [$dateFrom, $dateTo])
            ->get()
            ->keyBy(
                fn($holiday) =>
                Carbon::parse($holiday->holiday_date)->format('Y-m-d')
            );
    }
}
