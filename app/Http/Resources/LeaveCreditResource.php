<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveCreditResource extends JsonResource
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
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
            'leaveTypeBy' => new LeaveTypeResource($this->leaveTypeBy),
            'year' => $this->year,
            'entitled' => $this->entitled,
            'used' => $this->used,
            'balance' => $this->balance
        ];
    }
}
