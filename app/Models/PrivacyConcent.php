<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivacyConcent extends Model
{
    protected $fillable = [
        'user_id',
        'version',
        'accepted_at',
        'ip_address',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
