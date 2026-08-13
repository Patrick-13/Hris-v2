<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelTraining extends Model
{
    protected $fillable = [
        'id',
        'soNumber',
        'title',
        'dateFrom',
        'dateTo',
        'noofHours',
        'type',
        'venue',
        'description',
    ];

    public function employees()
    {
        return $this->belongsToMany(PersonnelEmployee::class, 'training_employees', 'training_id', 'employee_id', 'id', 'employee_id');
    }
}
