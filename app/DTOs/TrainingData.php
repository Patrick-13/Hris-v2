<?php

namespace App\DTOs;

class TrainingData
{
    public function __construct(
        public ?string $soNumber,
        public ?string $title,
        public ?string $dateFrom,
        public ?string $dateTo,
        public ?string $noofHours,
        public ?string $type,
        public ?string $venue,
        public ?string $description,
        public ?array $employees = []
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['soNumber'] ?? null,
            $data['title'] ?? null,
            $data['dateFrom'] ?? null,
            $data['dateTo'] ?? null,
            $data['noofHours'] ?? null,
            $data['type'] ?? null,
            $data['venue'] ?? null,
            $data['description'] ?? null,
            $data['employees'] ?? []
        );
    }
}
