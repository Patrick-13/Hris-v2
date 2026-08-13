<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
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
            'sec_name' => $this->sec_name,
            'sec_code' => $this->sec_code,
            'divisionBy' => new DivisionResource($this->divisionBy),
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
        ];
    }
}
