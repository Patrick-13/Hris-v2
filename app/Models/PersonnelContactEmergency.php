<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class PersonnelContactEmergency extends Model
{
    protected $fillable = [
        'employee_id',
        'fullName',
        'relationship',
        'phoneNumber',
        'workPhoneNumber',
        'mobileNumber',
        'status',
    ];
}
