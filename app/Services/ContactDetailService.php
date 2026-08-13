<?php

namespace App\Services;

use App\DTOs\ContactDetailData;
use App\Models\PersonnelContactdetails;

class ContactDetailService
{
    public function createContactDetail(ContactDetailData $data): PersonnelContactdetails
    {
        return PersonnelContactdetails::create([
            'employee_id' => $data->employee_id,
            'addressType' => $data->addressType,
            'country' => $data->country,
            'region' => $data->region,
            'province' => $data->province,
            'city' => $data->city,
            'barangay' => $data->barangay,
            'street' => $data->street,
            'houseNumber' => $data->houseNumber,
            'workemail' => $data->workemail,
            'otheremail' => $data->otheremail,
            'workphoneNumber' => $data->workphoneNumber,
            'homephoneNumber' => $data->homephoneNumber,
            'mobileNumber' => $data->mobileNumber,
        ]);
    }

    public function updateContactDetail(ContactDetailData $data, int $id): PersonnelContactdetails
    {
        $contactdetail = PersonnelContactdetails::findOrFail($id);

        $contactdetail->update([
            'employee_id' => $data->employee_id,
            'addressType' => $data->addressType,
            'country' => $data->country,
            'region' => $data->region,
            'province' => $data->province,
            'city' => $data->city,
            'barangay' => $data->barangay,
            'street' => $data->street,
            'houseNumber' => $data->houseNumber,
            'workemail' => $data->workemail,
            'otheremail' => $data->otheremail,
            'workphoneNumber' => $data->workphoneNumber,
            'homephoneNumber' => $data->homephoneNumber,
            'mobileNumber' => $data->mobileNumber,
        ]);

        return $contactdetail;
    }
}
