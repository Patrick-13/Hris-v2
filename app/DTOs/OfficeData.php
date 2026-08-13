<?php

namespace App\DTOs;

class OfficeData
{
    public function __construct(
        public ?string $office_code,
        public ?string $office_name,
        public ?string $address,
        public ?string $latitude,
        public ?string $longitude,
        public ?string $radius,
        public ?string $is_active
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['office_code'] ?? null,
            $data['office_name'] ?? null,
            $data['address'] ?? null,
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            $data['radius'] ?? null,
            $data['is_active'] ?? null,

        );
    }
}
