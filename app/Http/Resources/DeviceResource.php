<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
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
            'fundType' => $this->fundType,
            'ppeType' => $this->ppeType,
            'parNo' => $this->parNo,
            'categoryBy' => new DeviceCategoryResource($this->categoryBy),
            'description' => $this->description,
            'serial_number' => $this->serial_number,
            'property_number' => $this->property_number,
            'unitofMeasure' => $this->unitofMeasure,
            'quantity_property_card' => $this->quantity_property_card,
            'quantity_physical_count' => $this->quantity_physical_count,
            'brand' => $this->brand,
            'status' => $this->status,
            'price' => $this->price,
            'images' => $this->images,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
