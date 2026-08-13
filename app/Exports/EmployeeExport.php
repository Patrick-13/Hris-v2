<?php

namespace App\Exports;

use App\Models\PersonnelEmployee;
use Maatwebsite\Excel\Concerns\FromCollection;

class EmployeeExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return PersonnelEmployee::all([
            'employee_id',
            'lastname',
            'firstname',
            'middlename',
            'nickname',
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
            'date_hired',
            'emp_status',
        ]);
    }
}
