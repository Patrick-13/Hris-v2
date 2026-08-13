<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Memo extends Model
{
    protected $fillable = [
        'date_from',
        'date_to',
        'title',
        'status',
        'provinces',
        'memo_number',
    ];

    protected $casts = [
        'provinces' => 'array',
    ];
}
