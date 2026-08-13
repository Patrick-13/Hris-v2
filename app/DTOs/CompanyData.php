<?php

namespace App\DTOs;

class CompanyData
{
    public function __construct(
        public ?string $name,
        public ?string $address,
        public ?string $contact_number,
        public ?string $tel_number,
        public ?string $company_email
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'] ?? null,
            $data['address'] ?? null,
            $data['contact_number'] ?? null,
            $data['tel_number'] ?? null,
            $data['company_email'] ?? null
        );
    }
}
