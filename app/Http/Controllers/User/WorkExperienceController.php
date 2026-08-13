<?php

namespace App\Http\Controllers\User;

use App\DTOs\PeronnelWorkExperienceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\WorkExperienceStoreRequest;
use App\Http\Requests\WorkExperienceUpdateRequest;
use App\Models\PersonnelWorkexperience;
use App\Services\WorkExperienceService;

class WorkExperienceController extends Controller
{
    protected WorkExperienceService $workExperienceService;

    public function __construct(WorkExperienceService $workExperienceService)
    {
        $this->workExperienceService = $workExperienceService;
    }

    public function store(WorkExperienceStoreRequest $request)
    {
        $dto = PeronnelWorkExperienceData::fromArray($request->validated());

        $this->workExperienceService->createWorkexperience($dto);

        return redirect()->back()->with(['success' => 'Work Experience data Created successfully.']);
    }

    public function edit($id)
    {
        $workexperience = PersonnelWorkexperience::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($workexperience);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WorkExperienceUpdateRequest $request, $id)
    {
        $dto = PeronnelWorkExperienceData::fromArray($request->validated());

        $this->workExperienceService->updateWorkexperience($dto, $id);

        return redirect()->back()->with(['success' => 'Work Experience data updated successfully.']);
    }
}
