<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccomplishmentApprovalResource extends JsonResource
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
            'accomplishment_id' => $this->accomplishment_id,
            'approver' => $this->whenLoaded('approver', function () {
                return new PersonnelEmployeeResource($this->approver);
            }),
            'level' => $this->level,
            'status' => $this->status,
            'approved_at' => $this->approved_at,
        ];
    }
}
