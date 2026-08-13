<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkExperienceResource extends JsonResource
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
            'dateFrom' => $this->dateFrom,
            'dateTo' => $this->dateTo,
            'jobTitle' => $this->jobTitle,
            'emp_status' => $this->emp_status,
            'isGovernment' => $this->isGovernment,
            'department' => $this->department,
            'agency' => $this->agency,
            'office' => $this->office,
            'company' => $this->company,
            'branch' => $this->branch,
            'leave_absent' => $this->leave_absent,
            'monthysalary' => $this->monthysalary,
            'paycolumngrade' => $this->paycolumngrade,
            'separationCause' => $this->separationCause,
            'isActive' => $this->isActive,
        ];
    }
}
