<?php

namespace App\Http\Controllers\User;

use App\DTOs\ContactEmergencyData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactEmergencyStoreRequest;
use App\Http\Requests\ContactEmergencyUpdateRequest;
use App\Models\PersonnelContactEmergency;
use App\Services\ContactEmergencyService;

class PersonnelContactEmergencyController extends Controller
{
    protected ContactEmergencyService $contactEmergencyService;

    public function __construct(ContactEmergencyService $contactEmergencyService)
    {
        $this->contactEmergencyService = $contactEmergencyService;
    }


    public function store(ContactEmergencyStoreRequest $request)
    {
        $dto = ContactEmergencyData::fromArray($request->validated());

        $this->contactEmergencyService->createContactEmergency($dto);

        return redirect()->back()->with(['success' => 'Emergency Contact Created successfully.']);
    }

    public function edit($id)
    {
        $contactemergency = PersonnelContactEmergency::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($contactemergency);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactEmergencyUpdateRequest $request, $id)
    {
        $dto = ContactEmergencyData::fromArray($request->validated());

        $this->contactEmergencyService->updateContactEmergency($dto, $id);

        return redirect()->back()->with(['success' => 'Emergency Contact updated successfully.']);
    }
}
