<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'fundType',
        'ppeType',
        'parNo',
        'category_id',
        'description',
        'serial_number',
        'property_number',
        'unitofMeasure',
        'quantity_property_card',
        'quantity_physical_count',
        'brand',
        'status',
        'price',
        'images',
        'remarks',
    ];

    protected $casts = [
        'images' => 'array', // Automatically converts JSON to array
    ];

    public function categoryBy()
    {
        return $this->belongsTo(DeviceCategory::class, 'category_id', 'id');
    }
}
