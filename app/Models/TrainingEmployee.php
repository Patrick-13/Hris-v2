<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingEmployee extends Model
{
    protected $fillable = [
        'training_id',
        'employee_id',
    ];
}
