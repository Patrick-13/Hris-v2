<?php

namespace App\DTOs;

class ContactEmergencyData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $fullName,
        public ?string $relationship,
        public ?string $phoneNumber,
        public ?string $workPhoneNumber,
        public ?string $mobileNumber,
        public ?string $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'],
            $data['fullName'],
            $data['relationship'],
            $data['phoneNumber'],
            $data['workPhoneNumber'],
            $data['mobileNumber'],
            $data['status'] ?? '0',
        );
    }
}
