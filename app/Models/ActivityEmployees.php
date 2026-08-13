<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityEmployees extends Model
{
    protected $fillable = [
        'activity_id',
        'employee_id',
    ];
}
