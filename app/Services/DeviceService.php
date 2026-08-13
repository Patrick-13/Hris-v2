<?php

namespace App\Services;

use App\DTOs\DeviceData;
use App\Models\Device;
use Illuminate\Database\Eloquent\Collection;

class DeviceService
{
    public function createDevice(DeviceData $dto): Device
    {

        $imagePaths = [];

        if (!empty($dto->images)) {
            foreach ($dto->images as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = $image->store('devices', 'public');
                    $imagePaths[] = $path;
                }
            }
        }

        return Device::create([
            'fundType' => $dto->fundType,
            'ppeType' => $dto->ppeType,
            'parNo' => $dto->parNo,
            'category_id' => $dto->category_id,
            'description' => $dto->description,
            'serial_number' => $dto->serial_number,
            'property_number' => $dto->property_number,
            'unitofMeasure' => $dto->unitofMeasure,
            'quantity_property_card' => $dto->quantity_property_card,
            'quantity_physical_count' => $dto->quantity_physical_count,
            'brand' => $dto->brand,
            'status' => $dto->status,
            'price' => $dto->price,
            'images' => $imagePaths,
            'remarks' => $dto->remarks,
        ]);
    }

    public function updateDevice(DeviceData $dto, int $id): Device
    {

        $device = Device::findOrFail($id);

        $imagePaths = [];

        if (!empty($dto->images)) {
            foreach ($dto->images as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = $image->store('devices', 'public');
                    $imagePaths[] = $path;
                }
            }
        }

        $device->update([
            'fundType' => $dto->fundType,
            'ppeType' => $dto->ppeType,
            'parNo' => $dto->parNo,
            'category_id' => $dto->category_id,
            'description' => $dto->description,
            'serial_number' => $dto->serial_number,
            'property_number' => $dto->property_number,
            'unitofMeasure' => $dto->unitofMeasure,
            'quantity_property_card' => $dto->quantity_property_card,
            'quantity_physical_count' => $dto->quantity_physical_count,
            'brand' => $dto->brand,
            'status' => $dto->status,
            'price' => $dto->price,
            'images' => $imagePaths,
            'remarks' => $dto->remarks,
        ]);

        return $device;
    }
}
