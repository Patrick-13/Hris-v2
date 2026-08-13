<?php

namespace App\DTOs;

class MemoData
{
    public function __construct(
        public ?string $date_from,
        public ?string $date_to,
        public ?string $title,
        public ?string $status,
        public ?array $provinces,
        public ?string $memo_number,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['date_from'] ?? null,
            $data['date_to'] ?? null,
            $data['title'] ?? null,
            $data['status'] ?? null,
            $data['provinces'] ?? [],
            $data['memo_number'] ?? null,
        );
    }
}
