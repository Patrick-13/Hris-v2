<?php

namespace App\Services;

use App\DTOs\CategoryData;
use App\Models\DeviceCategory;

class CategoryService
{
    public function createCategory(CategoryData $data): DeviceCategory
    {
        return DeviceCategory::create([
            'name' => $data->name,
        ]);
    }

    public function updateCategory(CategoryData $data, int $id): DeviceCategory
    {
        $category = DeviceCategory::findOrFail($id);

        $category->update([
            'name' => $data->name,
        ]);

        return $category;
    }
}
