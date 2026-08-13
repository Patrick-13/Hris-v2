<?php

namespace App\Services\Dtr;

use App\Services\DtrCalnderService\DtrCalendarDataLoader;
use Carbon\CarbonPeriod;

class DtrCalendarService
{
    public function __construct(
        protected DtrCalendarDataLoader $loader,
        protected DtrStatusResolver $resolver
    ) {}

    public function build(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ): array {
        $context = $this->loader->load(
            $employeeId,
            $dateFrom,
            $dateTo
        );

        $result = [];

        foreach (
            CarbonPeriod::create($dateFrom, $dateTo) as $date
        ) {
            $result[] = $this->resolver->resolve(
                $date,
                $context
            );
        }

        return $result;
    }
}