<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeDeviceAssignmentResource extends JsonResource
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
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
            'deviceBy' => new DeviceResource($this->deviceBy),
            'employeecareOfBy' => new PersonnelEmployeeResource($this->employeecareOfBy),
            'assigned_at' => $this->assigned_at,
            'returned_at' => $this->returned_at,
            'remarks' => $this->remarks,

        ];
    }
}
