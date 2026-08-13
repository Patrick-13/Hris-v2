<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Overtime_accomplishment extends Model
{
    protected $fillable = [
        'overtime_id',
        'work_accomplished',
        'duration_hours',
        'attachment',
    ];

    public function overtime()
    {
        return $this->belongsTo(Personnelovertime::class, 'overtime_id');
    }

    public function approvals()
    {
        return $this->hasMany(Accomplishment_approval::class, 'accomplishment_id');
    }

    public function employee()
    {
        return $this->hasOneThrough(
            PersonnelEmployee::class,
            Personnelovertime::class,
            'id',            // Foreign key on personnelovertimes table
            'employee_id',   // Foreign key on personnel_employees table
            'overtime_id',   // Local key on overtime_accomplishments
            'employee_id'    // Local key on personnelovertimes
        );
    }
}
