<?php

namespace App\Http\Controllers\User;

use App\DTOs\TrainingFileData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TrainingFileStoreRequest;
use App\Models\TrainingFile;
use App\Services\TrainingFileService;
use Illuminate\Support\Facades\Storage;

class TrainingFileController extends Controller
{
    protected TrainingFileService $trainingFileService;

    public function __construct(TrainingFileService $trainingFileService)
    {
        $this->trainingFileService = $trainingFileService;
    }


    public function store(TrainingFileStoreRequest $request)
    {
        $data = $request->validated();
        $data['ilrFile'] = $request->file('ilrFile');
        $dto = TrainingFileData::fromArray($data);

        $this->trainingFileService->storeTrainingFile($dto);

        return redirect()->back()->with(['success' => 'Learning Report Uploaded successfully.']);
    }


    public function show($filename)
    {
        return $this->trainingFileService->showFile($filename);
    }
}
