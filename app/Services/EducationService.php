<?php

namespace App\Services;

use App\DTOs\EducationData;
use App\Models\PersonnelEducation;

class EducationService
{
    public function createEducation(EducationData $data): PersonnelEducation
    {
        return PersonnelEducation::create([
            'employee_id' => $data->employee_id,
            'educationLevel' => $data->educationLevel,
            'schoolName' => $data->schoolName,
            'degree' => $data->degree,
            'yeargraduate' => $data->yeargraduate,
            'highestlevel' => $data->highestlevel,
            'unitsEarned' => $data->unitsEarned,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'scholarship_honors' => $data->scholarship_honors,
            'isGraduated' => $data->isGraduated,
        ]);
    }

    public function updateEducation(EducationData $data, int $id): PersonnelEducation
    {
        $education = PersonnelEducation::findOrFail($id);

        $education->update([
            'employee_id' => $data->employee_id,
            'educationLevel' => $data->educationLevel,
            'schoolName' => $data->schoolName,
            'degree' => $data->degree,
            'yeargraduate' => $data->yeargraduate,
            'highestlevel' => $data->highestlevel,
            'unitsEarned' => $data->unitsEarned,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'scholarship_honors' => $data->scholarship_honors,
            'isGraduated' => $data->isGraduated,
        ]);

        return $education;
    }
}
