<?php

namespace App\DTOs;

class SalaryData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $salarySchedule,
        public ?string $payGrade,
        public ?string $steps,
        public ?string $amount,
        public ?string $salaryComponent,
        public ?string $payFrequency,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['salarySchedule'] ?? null,
            $data['payGrade'] ?? null,
            $data['steps'] ?? null,
            $data['amount'] ?? null,
            $data['salaryComponent'] ?? null,
            $data['payFrequency'] ?? null,

        );
    }
}
