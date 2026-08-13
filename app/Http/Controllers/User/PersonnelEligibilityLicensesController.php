<?php

namespace App\Http\Controllers\User;

use App\DTOs\PersonnelEligibilityLicensesData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EligibilityLicenseStoreRequest;
use App\Http\Requests\EligibilityLicenseUpdateRequest;
use App\Models\PersonnelEligibilityLicenses;
use App\Services\PersonnelEligibilityLicenseService;

class PersonnelEligibilityLicensesController extends Controller
{
    protected PersonnelEligibilityLicenseService $personnelEligibilityLicenseService;

    public function __construct(PersonnelEligibilityLicenseService $personnelEligibilityLicenseService)
    {
        $this->personnelEligibilityLicenseService = $personnelEligibilityLicenseService;
    }

    public function store(EligibilityLicenseStoreRequest $request)
    {
        $dto = PersonnelEligibilityLicensesData::fromArray($request->validated());

        $this->personnelEligibilityLicenseService->createEligibility($dto);

        return redirect()->back()->with(['success' => 'Eligibility data Created successfully.']);
    }

    public function edit($id)
    {
        $salary = PersonnelEligibilityLicenses::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($salary);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EligibilityLicenseUpdateRequest $request, $id)
    {
        $dto = PersonnelEligibilityLicensesData::fromArray($request->validated());

        $this->personnelEligibilityLicenseService->updateEligibility($dto, $id);

        return redirect()->back()->with(['success' => 'Eligibility data updated successfully.']);
    }
}
