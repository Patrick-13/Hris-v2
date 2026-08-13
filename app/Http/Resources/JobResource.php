<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
            'designation' => $this->designation,
            'jobTitle' => $this->jobTitle,
            'employmentStatus' => $this->employmentStatus,
            'jobCategory' => $this->jobCategory,
            'subUnit' => $this->subUnit,
            'contractAttachement' => $this->contractAttachement,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
        ];
    }
}
