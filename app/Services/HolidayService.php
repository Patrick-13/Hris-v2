<?php

namespace App\Services;

use App\DTOs\HolidayData;
use App\Models\Holiday;

class HolidayService
{
    public function createHoliday(HolidayData $data): Holiday
    {
        return Holiday::create([
            'holiday_date' => $data->holiday_date,
            'name' => $data->name,
            'type' => $data->type,
        ]);
    }

    public function getId(int $id): Holiday
    {
        return Holiday::findOrFail($id);
    }

    public function updateholiday(HolidayData $data, int $id): Holiday
    {
        $holiday = Holiday::findOrFail($id);

        $holiday->update([
            'holiday_date' => $data->holiday_date,
            'name' => $data->name,
            'type' => $data->type,
        ]);

        return $holiday;
    }
}
