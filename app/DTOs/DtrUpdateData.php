<?php

namespace App\DTOs;

class DtrUpdateData
{
    public function __construct(
        public ?string $timeIn,
        public ?string $breakOut,
        public ?string $breakIn,
        public ?string $timeOut,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['timeIn'] ?? null,
            $data['breakOut'] ?? null,
            $data['breakIn'] ?? null,
            $data['timeOut'] ?? null,
        );
    }
}
