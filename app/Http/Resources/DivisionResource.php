<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DivisionResource extends JsonResource
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
            'div_name' => $this->div_name,
            'div_code' => $this->div_code,
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
        ];
    }
}
