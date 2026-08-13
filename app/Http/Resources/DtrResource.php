<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DtrResource extends JsonResource
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
            'punch_date' => $this->punch_date,
            'timeIn' => $this->timeIn,
            'breakOut' => $this->breakOut,
            'breakIn' => $this->breakIn,
            'timeOut' => $this->timeOut,
            'tardiness' => $this->tardiness,
            'undertime' => $this->undertime,
            'overtime' => $this->overtime,
            'total_hours' => $this->total_hours,
            'employeeTransaction' => new PersonnelEmployeeResource($this->employeeTransaction),
            'flexi_type' => $this->flexi_type,
        ];
    }
}
