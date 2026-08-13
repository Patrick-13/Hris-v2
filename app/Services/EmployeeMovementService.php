<?php

namespace App\Services;

use App\DTOs\EmployeeMovementData;
use App\DTOs\JobData;
use App\Models\EmployeeMovement;
use App\Models\LeaveApproval;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelJob;
use App\Models\Position;
use App\Models\Section;

class EmployeeMovementService
{
    public function createEmployeeMovement(EmployeeMovementData $data, JobData $jobdata): EmployeeMovement
    {

        $employeeJob = PersonnelEmployee::where("employee_id", $data->employee_id)->first();

        if (!$employeeJob) {
            throw new \Exception("Employee not found in PersonnelEmployee table.");
        }

        $employeeMovement = EmployeeMovement::create([
            'company_id' => $data->company_id,
            'employee_id' => $data->employee_id,
            'division_id' => $data->division_id,
            'section_id' => $data->section_id,
            'position_id' => $data->position_id,
        ]);

        LeaveApproval::where('level', operator: 'hr')
            ->update([
                'approver_id' => $data->employee_id
            ]);

        PersonnelJob::create([
            'employee_id' => $data->employee_id,
            'designation' => $jobdata->designation,
            'jobTitle' => $data->positionBy->name ?? 'Unknown',
            'employmentStatus' => $jobdata->employmentStatus ?? 'Active',
            'jobCategory' => $employeeJob->jobCategory ?? 'Unknown',
            'subUnit' => $data->sectionBy->name ?? 'Unknown',
            'contractAttachement' => $jobdata->contractAttachement ?? null,
            'startDate' => $employeeJob->date_hired ?? now(),
            'endDate' => null,
        ]);

        return $employeeMovement;
    }

    public function updateEmployeeMovement(EmployeeMovementData $data, JobData $jobdata, int $id): EmployeeMovement
    {
        $employeemovement = EmployeeMovement::findOrFail($id);

        $employeeJob = PersonnelEmployee::where("employee_id", $data->employee_id)->first();

        $postname = Position::where("id", $data->position_id)->first();
        $secname = Section::where("id", $data->section_id)->first();

        if (!$employeeJob) {
            throw new \Exception("Employee not found in PersonnelEmployee table.");
        }


        $employeemovement->update([
            'company_id' => $data->company_id,
            'employee_id' => $data->employee_id,
            'division_id' => $data->division_id,
            'section_id' => $data->section_id,
            'position_id' => $data->position_id
        ]);

        PersonnelJob::create([
            'employee_id' => $data->employee_id,
            'designation' => $jobdata->designation,
            'jobTitle' => $postname->post_name ?? 'Unknown',
            'employmentStatus' => $jobdata->employmentStatus ?? 'Active',
            'jobCategory' => $employeeJob->jobCategory ?? 'Unknown',
            'subUnit' => $secname->sec_name ?? 'Unknown',
            'contractAttachement' => $jobdata->contractAttachement ?? null,
            'startDate' => $employeeJob->date_hired ?? now(),
            'endDate' => null,
        ]);


        return $employeemovement;
    }
}
