<?php

namespace App\DTOs;

class PrivacyConcentData
{
    public function __construct(
        public string $userId,
        public string $version,
        public ?string $ipAddress = null,
    ) {}


    public static function fromArray(array $data): self
    {
        return new self(
            $data['userId'] ?? null,
            $data['version'] ?? null,
            $data['ipAddress'] ?? null,
        );
    }
}
