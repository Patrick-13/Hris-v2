<?php

namespace App\Services;

use App\DTOs\SalaryData;
use App\Models\Salary;

class SalaryService
{
    public function createSalary(SalaryData $data): Salary
    {
        return Salary::create([
            'employee_id' => $data->employee_id,
            'salarySchedule' => $data->salarySchedule,
            'payGrade' => $data->payGrade,
            'steps' => $data->steps,
            'amount' => $data->amount,
            'salaryComponent' => $data->salaryComponent,
            'payFrequency' => $data->payFrequency,
        ]);
    }

    public function updateSalary(SalaryData $data, int $id): Salary
    {
        $job = Salary::findOrFail($id);

        $job->update([
            'employee_id' => $data->employee_id,
            'salarySchedule' => $data->salarySchedule,
            'payGrade' => $data->payGrade,
            'steps' => $data->steps,
            'amount' => $data->amount,
            'salaryComponent' => $data->salaryComponent,
            'payFrequency' => $data->payFrequency,
        ]);

        return $job;
    }
}
