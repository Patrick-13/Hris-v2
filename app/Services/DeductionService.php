<?php

namespace App\Services;

use App\DTOs\DeductionData;
use App\Models\EmployeeDeduction;

class DeductionService
{
    public function createDeduction(DeductionData $data): EmployeeDeduction
    {
        return EmployeeDeduction::create([
            'employee_id' => $data->employee_id,
            'sss' => $data->sss,
            'philhealth' => $data->philhealth,
            'pagibig' => $data->pagibig,
            'tax' => $data->tax,
            'union_fee' => $data->union_fee,
        ]);
    }

    public function getId(int $id): EmployeeDeduction
    {
        return EmployeeDeduction::findOrFail($id);
    }

    public function updateDeduction(DeductionData $data, int $id): EmployeeDeduction
    {
        $deduction = EmployeeDeduction::findOrFail($id);

        $deduction->update([
            'employee_id' => $data->employee_id,
            'sss' => $data->sss,
            'philhealth' => $data->philhealth,
            'pagibig' => $data->pagibig,
            'tax' => $data->tax,
            'union_fee' => $data->union_fee,
        ]);
        return $deduction;
    }
}
