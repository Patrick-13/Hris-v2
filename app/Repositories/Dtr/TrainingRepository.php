<?php

namespace App\Repositories\Dtr;

use App\Models\PersonnelTraining;

class TrainingRepository
{
    public function getByEmployeeAndRange($employeeId, $dateFrom, $dateTo)
    {
        return PersonnelTraining::whereHas('employees', function ($q) use ($employeeId) {
            $q->where('training_employees.employee_id', $employeeId); // <- specify table
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
