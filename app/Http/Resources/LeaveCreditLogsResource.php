<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveCreditLogsResource extends JsonResource
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
            'employee_name' => $this->employee
                ? "{$this->employee->lastname}, {$this->employee->firstname}"
                : null,

            'leave_type_id' => $this->leave_type_id,
            'leave_type' => $this->leaveType?->leave_type,
            'leaveType' => new LeaveTypeResource($this->whenLoaded('leaveType')),

            'year' => $this->year,
            'month' => $this->month,

            'earned' => $this->earned,

            'before_balance' => $this->before_balance,
            'after_balance' => $this->after_balance,

            'absent_days' => $this->absent_days,
            'half_days' => $this->half_days,

            'tardiness_hours' => $this->tardiness_hours,
            'undertime_hours' => $this->undertime_hours,
            'late_hours' => $this->late_hours,
            'late_equivalent_days' => $this->late_equivalent_days,

            'remarks' => $this->remarks,

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
