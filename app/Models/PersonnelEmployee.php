<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelEmployee extends Model
{
    protected $fillable = [
        'employee_id',
        'lastname',
        'firstname',
        'middlename',
        'nickname',
        'email',
        'date_of_birth',
        'gender',
        'civil_status',
        'citizenship',
        'weight',
        'height',
        'bloodtype',
        'gsis',
        'pagibig_number',
        'sss_number',
        'philhealth_number',
        'TIN',
        'date_hired',
        'emp_status',
        'employment_status',
        'flexi_type',
        'in_office',
        'daily_rate',
        'account_no',
        'fundtype',
        'charging',
        'province_office',
        'office_id'
    ];

    protected $casts = [
        'emp_status' => 'integer',
        'office_id' => 'array',
    ];





    public function leavesBy()
    {
        return $this->hasMany(PersonnelLeave::class, 'employee_id', 'employee_id');
    }

    public function employeeleaveBy()
    {
        return $this->belongsTo(PersonnelLeave::class, 'employee_id', 'employee_id');
    }

    public function overtimesBy()
    {
        return $this->hasMany(Personnelovertime::class, 'employee_id', 'employee_id');
    }

    public function employeeovertimeBy()
    {
        return $this->belongsTo(Personnelovertime::class, 'employee_id', 'employee_id');
    }

    public function leavecreditBy()
    {
        return $this->hasMany(LeaveCredit::class, 'employee_id', 'employee_id');
    }

    // Employee can also be an approver
    public function approvals()
    {
        return $this->hasMany(LeaveApproval::class, 'approver_id', 'employee_id');
    }

    public function overtimeapprovals()
    {
        return $this->hasMany(OvertimeApproval::class, 'approver_id', 'employee_id');
    }

    public function movement()
    {
        return $this->hasOne(EmployeeMovement::class, 'employee_id', 'employee_id');
    }

    public function employeeContactBy()
    {
        return $this->hasMany(PersonnelContactdetails::class, 'employee_id', 'employee_id');
    }
    public function employeeEmergencyBy()
    {
        return $this->hasMany(PersonnelContactEmergency::class, 'employee_id', 'employee_id');
    }

    public function employeeDependentBy()
    {
        return $this->hasMany(PersonnelDependent::class, 'employee_id', 'employee_id');
    }
    public function employeeJobBy()
    {
        return $this->hasMany(PersonnelJob::class, 'employee_id', 'employee_id');
    }
    public function employeeMigrationBy()
    {
        return $this->hasMany(PersonnelMigration::class, 'employee_id', 'employee_id');
    }
    public function employeeSalaryBy()
    {
        return $this->hasMany(Salary::class, 'employee_id', 'employee_id');
    }
    public function employeeEducationBy()
    {
        return $this->hasMany(PersonnelEducation::class, 'employee_id', 'employee_id');
    }

    public function employeeWorkExperienceBy()
    {
        return $this->hasMany(PersonnelWorkexperience::class, 'employee_id', 'employee_id');
    }

    public function employeeEligibilityBy()
    {
        return $this->hasMany(PersonnelEligibilityLicenses::class, 'employee_id', 'employee_id');
    }

    public function trainings()
    {
        return $this->belongsToMany(PersonnelTraining::class, 'training_employees', 'employee_id', 'training_id', 'employee_id', 'id');
    }

    public function activityBy()
    {
        return $this->belongsToMany(Activity::class, 'activity_employees', 'employee_id', 'activity_id', 'employee_id', 'id');
    }

    public function trainingFilesBy()
    {
        return $this->hasMany(TrainingFile::class, 'employee_id', 'employee_id');
    }

    public function dtrBy()
    {
        return $this->hasMany(Dtr::class, 'employee_id', 'employee_id');
    }

    public function deductions()
    {
        return $this->hasOne(EmployeeDeduction::class, 'employee_id', 'employee_id');
    }

    public function personelDeviceBy()
    {
        return $this->hasOne(Personnelemployeedevice::class, 'employee_id', 'employee_id');
    }

    public function tkos()
    {
        return $this->hasMany(Tko::class, 'employee_id', 'employee_id');
    }

    public function leaveCreditLogs()
    {
        return $this->hasMany(LeaveCreditLog::class, 'employee_id', 'employee_id');
    }

    public function offices()
    {
        return $this->belongsToMany(
            Office::class,
            'personnel_employee_office',
            'employee_id',
            'office_id'
        );
    }
    public function esignature()
    {
        return $this->hasOne(PersonnelEsignature::class, 'employee_id', 'employee_id');
    }
}
