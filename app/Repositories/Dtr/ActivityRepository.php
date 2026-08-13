<?php

namespace App\Repositories\Dtr;

use App\Models\Activity;

class ActivityRepository
{

    public function getByEmployeeAndRange($employeeId, $dateFrom, $dateTo)
    {
        return Activity::whereHas('employees', function ($q) use ($employeeId) {
            $q->where('activity_employees.employee_id', $employeeId); // <- specify table
        })
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('dateFrom', [$dateFrom, $dateTo])
                    ->orWhereBetween('dateTo', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('dateFrom', '<=', $dateFrom)
                            ->where('dateTo', '>=', $dateTo);
                    });
            })
            ->get();
    }
}
