<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelemployeedeviceResource extends JsonResource
{
    public static $wrap = true;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'emp_code' => $this->emp_code,
            'emp_code_digit' => $this->emp_code_digit,
            'employee_id' => $this->employee_id,
            'create_time' => $this->create_time,
            'change_time' => $this->change_time,
            'status' => $this->status,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'self_password' => $this->self_password,
            'dev_privilege' => $this->dev_privilege,
            'verify_mode' => $this->verify_mode,
            'hire_date' => $this->hire_date,
            'enable_payroll' => $this->enable_payroll,
            'app_status' => $this->app_status,
            'app_role' => $this->app_role,
            'is_active' => $this->is_active,
            'department_id' => $this->department_id,
            'position_id' => $this->position_id,
            'company_id' => $this->company_id,
            'enroll_sn' => $this->enroll_sn,
            'employee_iclock' => new IclockBiodataResource($this->employee_iclock),
        ];
    }
}
