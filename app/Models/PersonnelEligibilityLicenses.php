<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelEligibilityLicenses extends Model
{
    protected $fillable = ['employee_id', 'cse', 'rating', 'placeExamTaken', 'dateTaken', 'profLicenseNumber', 'dateRelease'];
}
