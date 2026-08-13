<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
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
            'title_id' => $this->title_id,
            'soNumber' => $this->soNumber,
            'dateFrom' => $this->dateFrom,
            'dateTo' => $this->dateTo,
            'noofHours' => $this->noofHours,
            'type' => $this->type,
            'venue' => $this->venue,
            'description' => $this->description,
            'activityTypeBy' => new ActivityTypeResource($this->activityTypeBy),
            'activityFileBy' => new ActivityFileResource($this->activityFileBy),

        ];
    }
}
