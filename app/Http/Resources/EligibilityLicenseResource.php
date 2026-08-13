<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EligibilityLicenseResource extends JsonResource
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
            'cse' => $this->cse,
            'rating' => $this->rating,
            'placeExamTaken' => $this->placeExamTaken,
            'dateTaken' => $this->dateTaken,
            'profLicenseNumber' => $this->profLicenseNumber,
            'dateRelease' => $this->dateRelease,
        ];
    }
}
