<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'email',
        'role',
        'password',
        'email_otp',
        'otp_expires_at'
    ];

    protected $casts = [
        'otp_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'usermodules', 'user_id', 'module_id');
    }

    public function submodules()
    {
        return $this->belongsToMany(Submodule::class, 'usersubmodules', 'user_id', 'submodule_id');
    }

    public function buttons()
    {
        return $this->belongsToMany(Button::class, 'userbuttons', 'user_id', 'button_id');
    }

    public function devices()
    {
        return $this->hasMany(UserDevice::class);
    }

    public function privacyConsents()
    {
        return $this->hasMany(PrivacyConcent::class);
    }
}
