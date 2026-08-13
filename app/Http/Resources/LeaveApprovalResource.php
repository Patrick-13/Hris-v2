<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveApprovalResource extends JsonResource
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
            'leave_id' => $this->leave_id,
            'approver_id' => $this->approver_id,
            'level' => $this->level,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'pending_at' => $this->pending_at,
            'approved_at' => $this->approved_at,
        ];
    }
}
