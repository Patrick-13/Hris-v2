<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnelemployeedevice extends Model
{
    protected $table = 'personnel_employee';

    protected $fillable = [
        "emp_code",
        'emp_code_digit',
        "employee_id",
        "create_time",
        "change_time",
        "status",
        "first_name",
        "last_name",
        "self_password",
        "dev_privilege",
        "verify_mode",
        "hire_date",
        "enable_payroll",
        "app_status",
        "app_role",
        "is_active",
        "department_id",
        "position_id",
        "company_id",
        "enroll_sn",
    ];
    public $timestamps = false;

    public function employeeList()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function employee_iclock()
    {
        return $this->belongsTo(Iclockbiodata::class, 'id', 'employee_id');
    }

    public function iclockTransactions()
    {
        return $this->hasMany(IclockTransaction::class, 'emp_code', 'emp_code');
    }
}
