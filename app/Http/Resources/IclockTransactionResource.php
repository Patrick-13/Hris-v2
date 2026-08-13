<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IclockTransactionResource extends JsonResource
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
            "emp_code" => $this->emp_code,
            "punch_time" => $this->punch_time,
            "punch_state" => $this->punch_state,
            "area_alias" => $this->area_alias,
            "is_attendance" => $this->is_attendance,
            'employee_transaction' => new PersonnelemployeedeviceResource($this->whenLoaded('employee_transaction')),
        ];
    }
}
