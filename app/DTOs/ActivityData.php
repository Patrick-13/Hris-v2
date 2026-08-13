<?php

namespace App\DTOs;

class ActivityData
{
    public function __construct(
        public ?int $title_id,
        public ?string $soNumber,
        public ?string $dateFrom,
        public ?string $dateTo,
        public ?string $noofHours,
        public ?string $type,
        public ?string $venue,
        public ?string $description,
        public ?bool $with_coc,
        public ?array $employees = [],


    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['title_id'] ?? null,
            $data['soNumber'] ?? null,
            $data['dateFrom'] ?? null,
            $data['dateTo'] ?? null,
            $data['noofHours'] ?? null,
            $data['type'] ?? null,
            $data['venue'] ?? null,
            $data['description'] ?? null,
            isset($data['with_coc'])
                ? filter_var($data['with_coc'], FILTER_VALIDATE_BOOLEAN)
                : null,
            $data['employees'] ?? [],

        );
    }
}
