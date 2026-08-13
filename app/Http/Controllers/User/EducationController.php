<?php

namespace App\Http\Controllers\User;

use App\DTOs\EducationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EducationStoreRequest;
use App\Http\Requests\EducationUpdateRequest;
use App\Models\PersonnelEducation;
use App\Services\EducationService;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    protected EducationService $educationService;

    public function __construct(EducationService $educationService)
    {
        $this->educationService = $educationService;
    }

    public function store(EducationStoreRequest $request)
    {
        $dto = EducationData::fromArray($request->validated());

        $this->educationService->createEducation($dto);

        return redirect()->back()->with(['success' => 'Education data Created successfully.']);
    }

    public function edit($id)
    {
        $education = PersonnelEducation::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($education);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EducationUpdateRequest $request, $id)
    {
        $dto = EducationData::fromArray($request->validated());

        $this->educationService->updateEducation($dto, $id);

        return redirect()->back()->with(['success' => 'Education data updated successfully.']);
    }
}
