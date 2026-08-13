<?php

namespace App\DTOs;

class LeaveTypeData
{
    public function __construct(
        public ?string $name,
        public ?string $default_entitlement,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'] ?? null,
            $data['default_entitlement'] ?? null,

        );
    }
}
