<?php

namespace App\Services;

use App\DTOs\DivisionData;
use App\Models\Division;

class DivisionService
{
    public function createDivision(DivisionData $data): Division
    {
        return Division::create([
            'div_name' => $data->div_name,
            'div_code' => $data->div_code,
            'immediate_supervisor' => $data->immediate_supervisor
        ]);
    }

    public function updateDivision(DivisionData $data, int $id): Division
    {
        $division = Division::findOrFail($id);

        $division->update([
            'div_name' => $data->div_name,
            'div_code' => $data->div_code,
            'immediate_supervisor' => $data->immediate_supervisor
        ]);

        return $division;
    }
}
