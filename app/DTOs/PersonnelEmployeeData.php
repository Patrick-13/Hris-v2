<?php

namespace App\DTOs;

class PersonnelEmployeeData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $lastname,
        public ?string $firstname,
        public ?string $middlename,
        public ?string $nickname,
        public ?string $email,
        public ?string $date_of_birth,
        public ?string $gender,
        public ?string $civil_status,
        public ?string $citizenship,
        public ?string $weight,
        public ?string $height,
        public ?string $bloodtype,
        public ?string $gsis,
        public ?string $pagibig_number,
        public ?string $sss_number,
        public ?string $philhealth_number,
        public ?string $TIN,
        public ?string $date_hired,
        public ?string $emp_status,
        public ?string $employment_status,
        public ?string $flexi_type,
        public ?string $in_office,
        public ?string $daily_rate,
        public ?string $account_no,
        public ?string $fundtype,
        public ?string $charging,
        public ?string $province_office,
        public array $office_id = [],
    ) {}


    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['lastname'] ?? null,
            $data['firstname'] ?? null,
            $data['middlename'] ?? null,
            $data['nickname'] ?? null,
            $data['email'] ?? null,
            $data['date_of_birth'] ?? null,
            $data['gender'] ?? null,
            $data['civil_status'] ?? null,
            $data['citizenship'] ?? null,
            $data['weight'] ?? null,
            $data['height'] ?? null,
            $data['bloodtype'] ?? null,
            $data['gsis'] ?? null,
            $data['pagibig_number'] ?? null,
            $data['sss_number'] ?? null,
            $data['philhealth_number'] ?? null,
            $data['TIN'] ?? null,
            $data['date_hired'] ?? null,
            $data['emp_status'] ?? null,
            $data['employment_status'] ?? null,
            $data['flexi_type'] ?? null,
            $data['in_office'] ?? null,
            $data['daily_rate'] ?? null,
            $data['account_no'] ?? null,
            $data['fundtype'] ?? null,
            $data['charging'] ?? null,
            $data['province_office'] ?? null,
            $data['office_id'] ?? [],
        );
    }
}
