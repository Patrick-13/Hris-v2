<?php

namespace App\DTOs;

class SectionData
{
    public function __construct(
        public ?string $sec_name,
        public ?string $sec_code,
        public ?string $div_id,
        public ?string $sec_immediate_supervisor,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['sec_name'] ?? null,
            $data['sec_code'] ?? null,
            $data['div_id'] ?? null,
            $data['sec_immediate_supervisor'] ?? null,
        );
    }
}
