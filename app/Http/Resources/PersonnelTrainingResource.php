<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelTrainingResource extends JsonResource
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
            'soNumber' => $this->soNumber,
            'title' => $this->title,
            'dateFrom' => $this->dateFrom,
            'dateTo' => $this->dateTo,
            'noofHours' => $this->noofHours,
            'type' => $this->type,
            'venue' => $this->venue,
            'description' => $this->description,
            'trainingBy' => new TrainingEmployeeResource($this->trainingBy),

        ];
    }
}
