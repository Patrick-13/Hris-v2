<?php

namespace App\Services;

use App\DTOs\MemoData;
use App\Models\Memo;

class MemoService
{
    public function createMemo(MemoData $data): Memo
    {
        return Memo::create([
            'date_from' => $data->date_from,
            'date_to' => $data->date_to,
            'title' => $data->title,
            'status' => $data->status,
            'provinces' => $data->provinces,
            'memo_number' => $data->memo_number,
        ]);
    }

    public function getId(int $id): Memo
    {
        return Memo::findOrFail($id);
    }

    public function updateMemo(MemoData $data, int $id): Memo
    {
        $memo = Memo::findOrFail($id);

        $memo->update([
            'date_from' => $data->date_from,
            'date_to' => $data->date_to,
            'title' => $data->title,
            'status' => $data->status,
            'provinces' => $data->provinces,
            'memo_number' => $data->memo_number,
        ]);

        return $memo;
    }
}
