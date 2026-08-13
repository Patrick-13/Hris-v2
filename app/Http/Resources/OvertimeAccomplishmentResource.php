<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OvertimeAccomplishmentResource extends JsonResource
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
            'work_accomplished' => $this->work_accomplished,
            'overtime' => new PersonnelOvertimeResource($this->whenLoaded('overtime')),
            'approvals' => AccomplishmentApprovalResource::collection($this->whenLoaded('approvals')),
            'duration_hours' => $this->duration_hours,
            'attachment' => $this->attachment,
        ];
    }
}
