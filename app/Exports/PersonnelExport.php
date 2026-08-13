<?php

namespace App\Exports;

use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\PersonnelEmployee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PersonnelExport implements FromCollection, WithHeadings, WithMapping
{

    /**
     * @return \Illuminate\Support\Collection
     */

    public function collection()
    {
        return PersonnelEmployeeResource::collection(
            PersonnelEmployee::all()
        )->collection;
    }

    public function headings(): array
    {
        return [
            'Employee ID',
            'Last Name',
            'First Name',
            'Middle Name',
            'Nickname',
            'Email',
            'Contact No.',
            'Date of Birth',
            'Gender',
            'Civil Status',
            'Address',
            'Citizenship',
            'Weight',
            'Height',
            'Blood Type',
            'GSIS',
            'Pag-IBIG',
            'SSS',
            'PhilHealth',
            'TIN',
            'Date Hired',
            'Employee Status',
            'Employment Status',
            'Flexi Type',
            'In Office',
            'Daily Rate',
            'Account No',
            'Fund Type',
            'Charging',
            'Province Office',
        ];
    }

    public function map($personnel): array
    {

        $present = $personnel->employeeContactBy
            ->firstWhere('addressType', 'Residential');

        $address = '';

        if ($present) {
            $address = implode(', ', array_filter([
                $present->houseNumber,
                $present->street,
                optional($present->barangayBy)->name,
                optional($present->cityBy)->name,
                optional($present->provinceBy)->name,
                optional($present->regionBy)->name,
                $present->country,
            ]));
        }

        return [
            $personnel->employee_id,
            $personnel->lastname,
            $personnel->firstname,
            $personnel->middlename,
            $personnel->nickname,
            $personnel->email,
            optional($personnel->employeeContactBy->first())->mobileNumber,
            $personnel->date_of_birth,
            $personnel->gender,
            $personnel->civil_status,
            $address,
            $personnel->citizenship,
            $personnel->weight,
            $personnel->height,
            $personnel->bloodtype,
            $personnel->gsis,
            $personnel->pagibig_number,
            $personnel->sss_number,
            $personnel->philhealth_number,
            $personnel->TIN,
            $personnel->date_hired,
            $personnel->emp_status,
            $personnel->employment_status,
            $personnel->flexi_type,
            $personnel->in_office,
            $personnel->daily_rate,
            $personnel->account_no,
            $personnel->fundtype,
            $personnel->charging,
            $personnel->province_office,
        ];
    }
}
