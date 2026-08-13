<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OvertimeReturnHistoryResource extends JsonResource
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
            'overtime_id' => $this->overtime_id,
            'approver_id' => $this->approver_id,
            'approver_name' => $this->approver
                ? trim(
                    $this->approver->firstname . ' ' .
                        $this->approver->middlename . ' ' .
                        $this->approver->lastname
                )
                : null,
            'level' => $this->level,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }
}
