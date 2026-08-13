<?php

namespace App\Repositories\Dtr;

use App\Models\Dtr;

class DtrRepository
{

    public function getByRange($employeeId, $dateFrom, $dateTo)
    {
        return Dtr::where('employee_id', $employeeId)
            ->whereBetween('punch_date', [$dateFrom, $dateTo])
            ->get()
            ->keyBy(fn($dtr) => $dtr->punch_date->format('Y-m-d'));
    }
}
