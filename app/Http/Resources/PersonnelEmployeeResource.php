<?php

namespace App\Http\Resources;

use App\Models\PersonnelLeave;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelEmployeeResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'employeeContactBy' => ContactDetailResource::collection($this->employeeContactBy),
            'employeeEmergencyBy' => ContactEmergencyResource::collection($this->employeeEmergencyBy),
            'employeeDependentBy' => DependentResource::collection($this->employeeDependentBy),
            'employeeJobBy' => JobResource::collection($this->employeeJobBy),
            'employeeMigrationBy' => MigrationResource::collection($this->employeeMigrationBy),
            'employeeSalaryBy' => SalaryResource::collection($this->employeeSalaryBy),
            'employeeEducationBy' => EducationResource::collection($this->employeeEducationBy),
            'employeeWorkExperienceBy' => WorkExperienceResource::collection($this->employeeWorkExperienceBy),
            'employeeEligibilityBy' => EligibilityLicenseResource::collection($this->employeeEligibilityBy),
            'trainings' =>  PersonnelTrainingResource::collection($this->trainings),
            'activityBy' =>  ActivityResource::collection($this->activityBy),
            'trainingFilesBy' => TrainingFileResource::collection($this->trainingFilesBy),
            // 'dtrBy' => DtrResource::collection($this->dtrBy),
            'personelDeviceBy' => new PersonnelemployeedeviceResource($this->personelDeviceBy),
            'movement' => $this->whenLoaded(
                'movement',
                fn() => new EmployeeMovementResource($this->movement)
            ),
            'lastname' => $this->lastname,
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'civil_status' => $this->civil_status,
            'citizenship' => $this->citizenship,
            'weight' => $this->weight,
            'height' => $this->height,
            'bloodtype' => $this->bloodtype,
            'gsis' => $this->gsis,
            'pagibig_number' => $this->pagibig_number,
            'sss_number' => $this->sss_number,
            'philhealth_number' => $this->philhealth_number,
            'TIN' => $this->TIN,
            'date_hired' => $this->date_hired,
            'emp_status' => $this->emp_status,
            'employment_status' => $this->employment_status,
            'flexi_type' => $this->flexi_type,
            'in_office' => $this->in_office,
            'daily_rate' => $this->daily_rate,
            'account_no' => $this->account_no,
            'province_office' => $this->province_office,
            'office_id' => $this->office_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
