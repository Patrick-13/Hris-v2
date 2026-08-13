<?php

namespace App\Services;

use App\DTOs\PositionData;
use App\Models\Position;

class PositionService
{
    public function createPosition(PositionData $data): Position
    {
        return Position::create([
            'post_name' => $data->post_name,
            'post_code' => $data->post_code,
            'sec_id' => $data->sec_id,
        ]);
    }

    public function getId(int $id): Position
    {
        return Position::findOrFail($id);
    }

    public function updatePosition(PositionData $data, int $id): Position
    {
        $position = Position::findOrFail($id);

        $position->update([
            'post_name' => $data->post_name,
            'post_code' => $data->post_code,
            'sec_id' => $data->sec_id,
        ]);

        return $position;
    }
}
