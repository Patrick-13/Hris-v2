<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeResource extends JsonResource
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
            'office_code' => $this->office_code,
            'office_name' => $this->office_name,
            'address' => $this->address,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'radius' => (float) $this->radius,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->format('F d, Y h:i A'),
            'updated_at' => $this->updated_at?->format('F d, Y h:i A'),
        ];
    }
}
