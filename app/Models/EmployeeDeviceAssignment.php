<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class EmployeeDeviceAssignment extends Model
{

    protected $fillable = ['employee_id', 'device_id', 'device_careOf', 'assigned_at', 'returned_at', 'remarks'];

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
    public function employeecareOfBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'device_careOf', 'employee_id');
    }

    public function deviceBy()
    {
        return $this->belongsTo(Device::class, 'device_id', 'id');
    }

}
