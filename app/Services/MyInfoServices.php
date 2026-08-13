<?php

namespace App\Services;

use App\Models\PersonnelLeave;

class MyInfoServices
{

    public function getPersonnelLeaves($employeeId)
    {
        return PersonnelLeave::where('employee_id', $employeeId)->get();
    }
}
