<?php

namespace App\DTOs;

class DtrContext
{
    public function __construct(
        public $employee,
        public $dtrs,
        public $leaves,
        public $activities,
        public $trainings,
        public $travelOrders,
        public $holidays,
        public $memos,
        public $tkos,
    ) {}
}