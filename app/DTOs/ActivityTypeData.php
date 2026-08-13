<?php

namespace App\DTOs;

class ActivityTypeData
{
    public function __construct(
        public ?string $name,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'] ?? null,
        );
    }
}
