<?php

namespace App\Services;

use App\DTOs\FormTypeData;
use App\Models\Formtype;

class FormTypeService
{
    public function createFormType(FormTypeData $data): Formtype
    {
        return Formtype::create([
            'name' => $data->name,

        ]);
    }

    public function updateFormType(FormTypeData $data, int $id): Formtype
    {
        $formtype = Formtype::findOrFail($id);

        $formtype->update([
            'name' => $data->name,
        ]);

        return $formtype;
    }
}
