<?php

namespace App\Services;

use App\DTOs\SectionData;
use App\Models\Section;

class SectionService
{
    public function createSection(SectionData $data): Section
    {
        return Section::create([
            'sec_name' => $data->sec_name,
            'sec_code' => $data->sec_code,
            'div_id' => $data->div_id,
            'sec_immediate_supervisor' => $data->sec_immediate_supervisor
        ]);
    }

    public function getId(int $id): Section
    {
        return Section::findOrFail($id);
    }

    public function updateSection(SectionData $data, int $id): Section
    {
        $section = Section::findOrFail($id);

        $section->update([
            'sec_name' => $data->sec_name,
            'sec_code' => $data->sec_code,
            'div_id' => $data->div_id,
            'sec_immediate_supervisor' => $data->sec_immediate_supervisor
        ]);

        return $section;
    }
}
