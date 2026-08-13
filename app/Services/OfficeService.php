<?php

namespace App\Services;


use App\DTOs\OfficeData;
use App\Models\Office;

class OfficeService
{
    public function createOffice(OfficeData $data): Office
    {
        return Office::create([
            'office_code' => $data->office_code,
            'office_name' => $data->office_name,
            'address' => $data->address,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'radius' => $data->radius,
            'is_active' => 1,
        ]);
    }

    public function updateOffice(OfficeData $data, int $id): Office
    {
        $office = Office::findOrFail($id);

        $office->update([
            'office_code' => $data->office_code,
            'office_name' => $data->office_name,
            'address' => $data->address,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'radius' => $data->radius,
            'is_active' => 1,
        ]);

        return $office;
    }
}
