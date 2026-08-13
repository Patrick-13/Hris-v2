<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TkoApprovalResource extends JsonResource
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
            'tko_id' => $this->tko_id,
            'approver_id' => $this->approver_id,
            'level' => $this->level,
            'status' => $this->status,
            'approved_at' => $this->approved_at,
        ];
    }
}
