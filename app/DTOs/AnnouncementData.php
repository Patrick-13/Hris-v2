<?php

namespace App\DTOs;

class AnnouncementData
{
    public function __construct(
        public ?string $title,
        public ?string $body,
        public ?string $date_of_announcement,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['title'] ?? null,
            $data['body'] ?? null,
            $data['date_of_announcement'] ?? null,
        );
    }
}
