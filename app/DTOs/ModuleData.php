<?php

namespace App\DTOs;

class ModuleData
{
    public function __construct(
        public ?string $moduleName,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['moduleName'] ?? null,
        );
    }
}
