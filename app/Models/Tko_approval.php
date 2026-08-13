<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tko_approval extends Model
{
    protected $fillable = [
        'tko_id',
        'approver_id',
        'level',
        'status',
        'remarks',
        'approved_at',
    ];

    // Approval belongs to a leave
    public function tko()
    {
        return $this->belongsTo(Tko::class, 'tko_id');
    }

    // Approver is an employee
    public function approver()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'approver_id', 'employee_id');
    }
}
