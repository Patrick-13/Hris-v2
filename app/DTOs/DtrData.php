<?php

namespace App\DTOs;

class DtrData
{
    public function __construct(
        public string $employee_id,
        public string $punch_date,
        public ?string $timeIn,
        public ?string $breakOut,
        public ?string $breakIn,
        public ?string $timeOut,
        public ?string $tardiness,
        public ?string $undertime,
        public ?string $total_hours,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['punch_date'] ?? null,
            $data['timeIn'] ?? null,
            $data['breakOut'] ?? null,
            $data['breakIn'] ?? null,
            $data['timeOut'] ?? null,
            $data['tardiness'] ?? null,
            $data['undertime'] ?? null,
            $data['total_hours'] ?? null,
        );
    }
}
