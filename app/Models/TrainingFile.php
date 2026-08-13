<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingFile extends Model
{
    protected $fillable = [
        'employee_id',
        'training_id',
        'ilrFile',
    ];

    public function employee()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function training()
    {
        return $this->belongsTo(PersonnelTraining::class, 'training_id');
    }
}
