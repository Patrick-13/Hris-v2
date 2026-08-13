<?php

namespace App\DTOs;

class PositionData
{
    public function __construct(
        public ?string $post_name,
        public ?string $post_code,
        public ?string $sec_id,


    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['post_name'] ?? null,
            $data['post_code'] ?? null,
            $data['sec_id'] ?? null,
        );
    }
}
