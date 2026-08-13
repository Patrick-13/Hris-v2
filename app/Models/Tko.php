<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tko extends Model
{
    protected $table = 'tkos';
    protected $fillable = [
        'employee_id',
        'tko_type',
        'date',
        'tko_time', // or tko_time if you renamed it
        'attachment_file',
        'remarks',
    ];

    // Relationship to Employee
    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function approvals()
    {
        return $this->hasMany(Tko_approval::class, 'tko_id');
    }
}
