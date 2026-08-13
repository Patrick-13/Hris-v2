<?php

namespace App\Services;

use App\DTOs\DependentData;
use App\Models\PersonnelDependent;

class DependentService
{
    public function createDependent(DependentData $data): PersonnelDependent
    {
        return PersonnelDependent::create([
            'employee_id' => $data->employee_id,
            'lastName' => $data->lastName,
            'firstName' => $data->firstName,
            'middleName' => $data->middleName,
            'relationship' => $data->relationship,
            'dateofBirth' => $data->dateofBirth,
            'status' => $data->status,
        ]);
    }

    public function updateDependent(DependentData $data, int $id): PersonnelDependent
    {
        $dependent = PersonnelDependent::findOrFail($id);

        $dependent->update([
            'employee_id' => $data->employee_id,
            'lastName' => $data->lastName,
            'firstName' => $data->firstName,
            'middleName' => $data->middleName,
            'relationship' => $data->relationship,
            'dateofBirth' => $data->dateofBirth,
            'status' => $data->status,
        ]);

        return $dependent;
    }
}
