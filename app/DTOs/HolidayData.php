<?php

namespace App\DTOs;

class HolidayData
{
    public function __construct(
        public ?string $holiday_date,
        public ?string $name,
        public ?string $type,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['holiday_date'] ?? null,
            $data['name'] ?? null,
            $data['type'] ?? null,
        );
    }
}
