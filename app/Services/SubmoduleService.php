<?php

namespace App\Services;

use App\DTOs\SubmoduleData;
use App\Models\Submodule;

class SubmoduleService
{
    public function createSubModule(SubmoduleData $data): Submodule
    {
        return Submodule::create([
            'submoduleName' => $data->submoduleName,
            'module_id' => $data->module_id,
        ]);
    }

    public function getId(int $id): Submodule
    {
        return Submodule::findOrFail($id);
    }

    public function updateSubModule(SubmoduleData $data, int $id): Submodule
    {
        $submodule = Submodule::findOrFail($id);

        $submodule->update([
            'submoduleName' => $data->submoduleName,
            'module_id' => $data->module_id,
        ]);

        return $submodule;
    }
}
