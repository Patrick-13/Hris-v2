<?php

namespace App\Repositories\Dtr;

use App\Models\PersonnelLeave;

class LeaveRepository
{
    public function getByEmployeeAndRange($employeeId, $dateFrom, $dateTo)
    {
        return PersonnelLeave::where('employee_id', $employeeId)
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('start_date', [$dateFrom, $dateTo])
                    ->orWhereBetween('end_date', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('start_date', '<=', $dateFrom)
                            ->where('end_date', '>=', $dateTo);
                    });
            })
            ->get();
    }
}
