<?php

namespace App\DTOs;

class MigrationData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $documentAttachement,
        public ?string $number,
        public ?string $issuedBy,
        public ?string $issuedDate,
        public ?string $expiryDate,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['documentAttachement'] ?? null,
            $data['number'] ?? null,
            $data['issuedBy'] ?? null,
            $data['issuedDate'] ?? null,
            $data['expiryDate'] ?? null
        );
    }
}
