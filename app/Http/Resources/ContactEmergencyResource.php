<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactEmergencyResource extends JsonResource
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
            'id'              => $this->id,
            'employee_id'        => $this->employee_id,
            'fullName'        => $this->fullName,
            'relationship'    => $this->relationship,
            'phoneNumber'      => $this->phoneNumber,
            'workPhoneNumber' => $this->workPhoneNumber,
            'mobileNumber' => $this->mobileNumber,
            'status'    => $this->status,
        ];
    }
}
