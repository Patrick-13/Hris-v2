<?php

namespace App\DTOs;

class DivisionData
{
    public function __construct(
        public ?string $div_name,
        public ?string $div_code,
        public ?string $immediate_supervisor,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['div_name'] ?? null,
            $data['div_code'] ?? null,
            $data['immediate_supervisor'] ?? null,
        );
    }
}
