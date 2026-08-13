<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submodule extends Model
{
    protected $fillable = ['id', 'submoduleName', 'module_id'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'usersubmodules', 'submodule_id', 'user_id');
    }

    public function moduleBy()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
