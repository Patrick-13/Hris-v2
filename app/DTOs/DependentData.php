<?php

namespace App\DTOs;

class DependentData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $lastName,
        public ?string $firstName,
        public ?string $middleName,
        public ?string $relationship,
        public ?string $dateofBirth,
        public ?string $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['lastName'] ?? null,
            $data['firstName'] ?? null,
            $data['middleName'] ?? null,
            $data['relationship'] ?? null,
            $data['dateofBirth'] ?? null,
            $data['status'] ?? null
        );
    }
}
