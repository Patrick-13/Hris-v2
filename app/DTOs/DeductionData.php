<?php

namespace App\DTOs;

class DeductionData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $sss,
        public ?string $philhealth,
        public ?string $pagibig,
        public ?string $tax,
        public ?string $union_fee,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['sss'] ?? null,
            $data['philhealth'] ?? null,
            $data['pagibig'] ?? null,
            $data['tax'] ?? null,
            $data['union_fee'] ?? null,
        );
    }
}
