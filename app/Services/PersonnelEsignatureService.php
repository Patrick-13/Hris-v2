<?php

namespace App\Services;

use App\DTOs\ProfileEsignature;
use App\Models\PersonnelEsignature;

class PersonnelEsignatureService
{
    public function createEsignature(ProfileEsignature $data): PersonnelEsignature
    {
        $pathprofile = null;
        $pathesign = null;

        if ($data->profilePicture) {
            $file = $data->profilePicture;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "profile_pic");
            $filename = time() . '_' . $file->getClientOriginalName();

            $pathprofile = $file->storeAs("lastname/{$folder}", $filename, 'network');
        }

        if ($data->profileEsignature) {
            $file = $data->profileEsignature;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "esignature");
            $filename = time() . '_' . $file->getClientOriginalName();

            $pathesign = $file->storeAs("lastname/{$folder}", $filename, 'network');
        }



        $profile_esign_pic = PersonnelEsignature::updateOrCreate(
            ['employee_id' => $data->employee_id],
            [
                'profilePicture' => $pathprofile,
                'profileEsignature' => $pathesign,
            ]
        );



        return $profile_esign_pic;
    }
}
