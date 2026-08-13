<?php

namespace App\Services;

use App\DTOs\ModuleData;
use App\Models\Module;

class ModuleService
{
    public function createModule(ModuleData $data): Module
    {
        return Module::create([
            'moduleName' => $data->moduleName,
        ]);
    }

    public function updateModule(ModuleData $data, int $id): Module
    {
        $module = Module::findOrFail($id);

        $module->update([
            'moduleName' => $data->moduleName,
        ]);

        return $module;
    }
}
