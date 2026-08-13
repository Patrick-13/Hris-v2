<?php

namespace App\Services;

use App\DTOs\ActivityTypeData;
use App\Models\ActivityType;

class ActivityTypeService
{
    public function createActivityType(ActivityTypeData $data): ActivityType
    {
        return ActivityType::create([
            'name' => $data->name,
        ]);
    }

    public function updateActivityType(ActivityTypeData $data, int $id): ActivityType
    {
        $activitytype = ActivityType::findOrFail($id);

        $activitytype->update([
            'name' => $data->name,
        ]);

        return $activitytype;
    }
}
