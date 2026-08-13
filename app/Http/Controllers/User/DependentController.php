<?php

namespace App\Http\Controllers\User;

use App\DTOs\DependentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DependentStoreRequest;
use App\Http\Requests\DependentUpdateRequest;
use App\Models\PersonnelDependent;
use App\Services\DependentService;

class DependentController extends Controller
{
    protected DependentService $dependentService;

    public function __construct(DependentService $dependentService)
    {
        $this->dependentService = $dependentService;
    }

    public function store(DependentStoreRequest $request)
    {
        $dto = DependentData::fromArray($request->validated());

        $this->dependentService->createDependent($dto);

        return redirect()->back()->with(['success' => 'Dependent data Created successfully.']);
    }

    public function edit($id)
    {
        $dependent = PersonnelDependent::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($dependent);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DependentUpdateRequest $request, $id)
    {
        $dto = DependentData::fromArray($request->validated());

        $this->dependentService->updateDependent($dto, $id);

        return redirect()->back()->with(['success' => 'Dependent data updated successfully.']);
    }
}
