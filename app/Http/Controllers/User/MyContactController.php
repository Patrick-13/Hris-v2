<?php

namespace App\Http\Controllers\User;

use App\DTOs\ContactDetailData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactDetailStoreRequest;
use App\Http\Requests\ContactDetailUpdateRequest;
use App\Http\Resources\ContactDetailResource;
use App\Models\Barangay;
use App\Models\City;
use App\Models\PersonnelContactdetails;
use App\Models\Province;
use App\Models\Region;
use App\Services\ContactDetailService;

class MyContactController extends Controller
{
    protected ContactDetailService $contactDetailService;

    public function __construct(ContactDetailService $contactDetailService)
    {
        $this->contactDetailService = $contactDetailService;
    }


    public function store(ContactDetailStoreRequest $request)
    {
        $dto = ContactDetailData::fromArray($request->validated());

        $this->contactDetailService->createContactDetail($dto);


        return redirect()->back()->with(['success' => 'Personnal Contact Created successfully.']);
    }

    public function edit($id)
    {
        $contactdetail = PersonnelContactdetails::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($contactdetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactDetailUpdateRequest $request, $id)
    {
        $dto = ContactDetailData::fromArray($request->validated());

        $this->contactDetailService->updateContactDetail($dto, $id);

        return redirect()->back()->with(['success' => 'Personnal Contact Updated successfully.']);
    }
}
