<?php

namespace App\DTOs;

class LeaveCreditData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $leave_type_id,
        public ?string $year,
        public ?string $entitled,
        public ?string $used,
        public ?string $balance,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['leave_type_id'] ?? null,
            $data['year'] ?? null,
            $data['entitled'] ?? null,
            $data['used'] ?? null,
            $data['balance'] ?? null
        );
    }
}
