<?php

namespace App\Services;

use App\DTOs\JobData;
use App\Models\PersonnelJob;

class JobService
{
    public function createJob(JobData $data): PersonnelJob
    {
        return PersonnelJob::create([
            'employee_id' => $data->employee_id,
            'designation' => $data->designation,
            'jobTitle' => $data->jobTitle,
            'employmentStatus' => $data->employmentStatus,
            'jobCategory' => $data->jobCategory,
            'subUnit' => $data->subUnit,
            'contractAttachement' => $data->contractAttachement,
            'startDate' => $data->startDate,
            'endDate' => $data->endDate,
        ]);
    }

    public function getId(int $id): PersonnelJob
    {
        return PersonnelJob::findOrFail($id);
    }

    public function updateJob(JobData $data, int $id): PersonnelJob
    {
        $job = PersonnelJob::findOrFail($id);

        $job->update([
            'employee_id' => $data->employee_id,
            'designation' => $data->designation,
            'jobTitle' => $data->jobTitle,
            'employmentStatus' => $data->employmentStatus,
            'jobCategory' => $data->jobCategory,
            'subUnit' => $data->subUnit,
            'contractAttachement' => $data->contractAttachement,
            'startDate' => $data->startDate,
            'endDate' => $data->endDate,
        ]);

        return $job;
    }
}
