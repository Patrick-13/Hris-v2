<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelJob extends Model
{
    protected $fillable = ['employee_id', 'designation', 'jobTitle', 'employmentStatus', 'jobCategory', 'subUnit', 'contractAttachement', 'startDate', 'endDate'];
}
