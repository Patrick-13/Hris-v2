<?php

namespace App\DTOs;

class ContactDetailData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $addressType,
        public ?string $country,
        public ?string $region,
        public ?string $province,
        public ?string $city,
        public ?string $barangay,
        public ?string $street,
        public ?string $houseNumber,
        public ?string $workemail,
        public ?string $otheremail,
        public ?string $workphoneNumber,
        public ?string $homephoneNumber,
        public ?string $mobileNumber
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['addressType'] ?? null,
            $data['country'] ?? null,
            $data['region'] ?? null,
            $data['province'] ?? null,
            $data['city'] ?? null,
            $data['barangay'] ?? null,
            $data['street'] ?? null,
            $data['houseNumber'] ?? null,
            $data['workemail'] ?? null,
            $data['otheremail'] ?? null,
            $data['workphoneNumber'] ?? null,
            $data['homephoneNumber'] ?? null,
            $data['mobileNumber'] ?? null
        );
    }
}
