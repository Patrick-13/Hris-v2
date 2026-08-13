<?php


return [
    'FWA-B' => [
        'type'                => 'sliding',
        'shift_start'         => '07:00',
        'shift_end'           => '19:00',
        'tardiness_start'     => '08:00',
        'afternoon_tardiness_start' => '13:00:00',
        'required_work_hours' => 10,
        'lunch_break_hours'   => 1,
    ],
    'FWA-A' => [
        'type'            => 'fixed',
        'shift_start'     => '07:00',
        'shift_end'       => '18:00',
        'tardiness_start' => '09:00',
        'afternoon_tardiness_start' => '13:00:00',
        'lunch_break_hours' => 1,
        'pairs' => [
            '07:00' => '16:00',
            '08:00' => '17:00',   // add this
            '09:00' => '18:00',
        ],
    ]
];
