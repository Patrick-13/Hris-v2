<?php

namespace App\Http\Controllers\User;

use App\DTOs\ActivityFileData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityFileStoreRequest;
use App\Services\ActivityFileService;
use Illuminate\Support\Facades\Storage;

class ActivityFileController extends Controller
{
    protected ActivityFileService $activityFileService;

    public function __construct(ActivityFileService $activityFileService)
    {
        $this->activityFileService = $activityFileService;
    }


    public function store(ActivityFileStoreRequest $request)
    {
        $data = $request->validated();
        $data['activityFile'] = $request->file('activityFile');
        $dto = ActivityFileData::fromArray($data);

        $this->activityFileService->storeActivityFile($dto);

        return redirect()->back()->with(['success' => 'Activity Attachment Uploaded successfully.']);
    }


    public function show($filename)
    {
        return $this->activityFileService->showFile($filename);
    }
}
