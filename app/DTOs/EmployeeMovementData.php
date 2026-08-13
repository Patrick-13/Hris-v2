<?php

namespace App\DTOs;

class EmployeeMovementData
{
    public function __construct(
        public ?string $company_id,
        public ?string $employee_id,
        public ?string $division_id,
        public ?string $section_id,
        public ?string $position_id,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['company_id'] ?? null,
            $data['employee_id'] ?? null,
            $data['division_id'] ?? null,
            $data['section_id'] ?? null,
            $data['position_id'] ?? null,

        );
    }
}
