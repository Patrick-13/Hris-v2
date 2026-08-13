<?php

namespace App\DTOs;

class SubmoduleData
{
    public function __construct(
        public ?string $submoduleName,
        public ?string $module_id,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['submoduleName'] ?? null,
            $data['module_id'] ?? null,
        );
    }
}
