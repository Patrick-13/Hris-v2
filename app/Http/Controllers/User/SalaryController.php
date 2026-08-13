<?php

namespace App\Http\Controllers\User;

use App\DTOs\SalaryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\SalaryStoreRequest;
use App\Http\Requests\SalaryUpdateRequest;
use App\Models\Salary;
use App\Services\SalaryService;

class SalaryController extends Controller
{
    protected SalaryService $salaryService;

    public function __construct(SalaryService $salaryService)
    {
        $this->salaryService = $salaryService;
    }

    public function store(SalaryStoreRequest $request)
    {
        $dto = SalaryData::fromArray($request->validated());

        $this->salaryService->createSalary($dto);

        return redirect()->back()->with(['success' => 'Salary data Created successfully.']);
    }

    public function edit($id)
    {
        $salary = Salary::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($salary);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SalaryUpdateRequest $request, $id)
    {
        $dto = SalaryData::fromArray($request->validated());

        $this->salaryService->updateSalary($dto, $id);

        return redirect()->back()->with(['success' => 'Salary data updated successfully.']);
    }
}
