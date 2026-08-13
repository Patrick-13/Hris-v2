<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelContactdetails extends Model
{
    protected $fillable = [
        'employee_id',
        'addressType',
        'country',
        'region',
        'province',
        'city',
        'barangay',
        'street',
        'houseNumber',
        'workemail',
        'otheremail',
        'workphoneNumber',
        'homephoneNumber',
        'mobileNumber',
    ];

    public function provinceBy()
    {
        return $this->belongsTo(Province::class, 'province', 'code');
    }


    public function regionBy()
    {
        return $this->belongsTo(Region::class, 'region', 'code');
    }

    public function cityBy()
    {
        return $this->belongsTo(City::class, 'city', 'code');
    }

    public function barangayBy()
    {
        return $this->belongsTo(Barangay::class, 'barangay', 'code');
    }
}
