<?php

namespace App\Repositories\Dtr;

use App\Models\PersonnelEmployee;

class EmployeeRepository
{
    public function findByEmployeeId($employeeId)
    {
        return PersonnelEmployee::where('employee_id', $employeeId)->firstOrFail();
    }
}
