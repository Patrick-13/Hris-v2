<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EducationResource extends JsonResource
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
            'educationLevel' => $this->educationLevel,
            'schoolName' => $this->schoolName,
            'degree' => $this->degree,
            'yeargraduate' => $this->yeargraduate,
            'highestlevel' => $this->highestlevel,
            'unitsEarned' => $this->unitsEarned,
            'dateTo' => $this->dateTo,
            'endDate' => $this->endDate,
            'scholarship_honors' => $this->scholarship_honors,
            'isGraduated' => $this->isGraduated,
        ];
    }
}
