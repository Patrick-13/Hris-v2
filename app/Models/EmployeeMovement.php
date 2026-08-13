<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeMovement extends Model
{
    protected $fillable = ['company_id', 'employee_id', 'division_id', 'section_id', 'position_id'];

    public function companyBy()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }


    public function divisionBy()
    {
        return $this->belongsTo(Division::class, 'division_id');
    }

    public function sectionBy()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function positionBy()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }
}
