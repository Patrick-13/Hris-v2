<?php

namespace App\Services;


use App\DTOs\PeronnelWorkExperienceData;
use App\Models\PersonnelWorkexperience;

class WorkExperienceService
{

    public function createWorkexperience(PeronnelWorkExperienceData $data): PersonnelWorkexperience
    {
        return PersonnelWorkexperience::create([
            'employee_id' => $data->employee_id,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'jobTitle' => $data->jobTitle,
            'emp_status' => $data->emp_status,
            'isGovernment' => $data->isGovernment,
            'department' => $data->department,
            'agency' => $data->agency,
            'office' => $data->office,
            'company' => $data->company,
            'branch' => $data->branch,
            'leave_absent' => $data->leave_absent,
            'monthysalary' => $data->monthysalary,
            'paycolumngrade' => $data->paycolumngrade,
            'separationCause' => $data->separationCause,
            'isActive' => $data->isActive,
        ]);
    }

    public function updateWorkexperience(PeronnelWorkExperienceData $data, int $id): PersonnelWorkexperience
    {
        $workexperience = PersonnelWorkexperience::findOrFail($id);

        $workexperience->update([
            'employee_id' => $data->employee_id,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
            'jobTitle' => $data->jobTitle,
            'emp_status' => $data->emp_status,
            'isGovernment' => $data->isGovernment,
            'department' => $data->department,
            'agency' => $data->agency,
            'office' => $data->office,
            'company' => $data->company,
            'branch' => $data->branch,
            'leave_absent' => $data->leave_absent,
            'monthysalary' => $data->monthysalary,
            'paycolumngrade' => $data->paycolumngrade,
            'separationCause' => $data->separationCause,
            'isActive' => $data->isActive,
        ]);

        return $workexperience;
    }
}
