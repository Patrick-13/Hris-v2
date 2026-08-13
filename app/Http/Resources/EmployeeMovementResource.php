<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeMovementResource extends JsonResource
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
            'companyBy' => new CompanyResource($this->companyBy),
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
            'divisionBy' => new DivisionResource($this->divisionBy),
            'sectionBy' => new SectionResource($this->sectionBy),
            'positionBy' => new PositionResource($this->positionBy),
        ];
    }
}
