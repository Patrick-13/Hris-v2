<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnelemployeearea extends Model
{
    protected $table = 'personnel_employee_area';

    protected $fillable = [
        "id",
        "employee_id",
        "area_id"
    ];

    public $timestamps = false;
}
