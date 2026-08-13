<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeductionResource extends JsonResource
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
            'sss' => $this->sss,
            'philhealth' => $this->philhealth,
            'pagibig' => $this->pagibig,
            'tax' => $this->tax,
            'union_fee' => $this->union_fee,
        ];
    }
}
