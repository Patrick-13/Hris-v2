<?php

namespace App\Services;

use App\DTOs\PersonnelEligibilityLicensesData;
use App\Models\PersonnelEligibilityLicenses;

class PersonnelEligibilityLicenseService
{

    public function createEligibility(PersonnelEligibilityLicensesData $data): PersonnelEligibilityLicenses
    {
        return PersonnelEligibilityLicenses::create([
            'employee_id' => $data->employee_id,
            'cse' => $data->cse,
            'rating' => $data->rating,
            'placeExamTaken' => $data->placeExamTaken,
            'dateTaken' => $data->dateTaken,
            'profLicenseNumber' => $data->profLicenseNumber,
            'dateRelease' => $data->dateRelease,
        ]);
    }

    public function updateEligibility(PersonnelEligibilityLicensesData $data, int $id): PersonnelEligibilityLicenses
    {
        $eligibility = PersonnelEligibilityLicenses::findOrFail($id);

        $eligibility->update([
            'employee_id' => $data->employee_id,
            'cse' => $data->cse,
            'rating' => $data->rating,
            'placeExamTaken' => $data->placeExamTaken,
            'dateTaken' => $data->dateTaken,
            'profLicenseNumber' => $data->profLicenseNumber,
            'dateRelease' => $data->dateRelease,
        ]);

        return $eligibility;
    }
}
