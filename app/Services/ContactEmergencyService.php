<?php

namespace App\Services;

use App\DTOs\ContactEmergencyData;
use App\Models\PersonnelContactEmergency;

class ContactEmergencyService
{
    public function createContactEmergency(ContactEmergencyData $data): PersonnelContactEmergency
    {
        return PersonnelContactEmergency::create([
            'employee_id' => $data->employee_id,
            'fullName' => $data->fullName,
            'relationship' => $data->relationship,
            'phoneNumber' => $data->phoneNumber,
            'workPhoneNumber' => $data->workPhoneNumber,
            'mobileNumber' => $data->mobileNumber,
            'status' => $data->status,

        ]);
    }

    public function updateContactEmergency(ContactEmergencyData $data, int $id): PersonnelContactEmergency
    {
        $contactemergency = PersonnelContactEmergency::findOrFail($id);

        $contactemergency->update([
            'employee_id' => $data->employee_id,
            'fullName' => $data->fullName,
            'relationship' => $data->relationship,
            'phoneNumber' => $data->phoneNumber,
            'workPhoneNumber' => $data->workPhoneNumber,
            'mobileNumber' => $data->mobileNumber,
            'status' => $data->status,
        ]);

        return $contactemergency;
    }
}
