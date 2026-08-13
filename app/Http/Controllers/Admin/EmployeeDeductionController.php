<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\DeductionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeductionStoreRequest;
use App\Http\Requests\DeductionUpdateRequest;
use App\Http\Resources\DeductionResource;
use App\Models\EmployeeDeduction;
use App\Models\PersonnelEmployee;
use App\Services\DeductionService;
use Illuminate\Http\Request;

class EmployeeDeductionController extends Controller
{
    protected DeductionService $deductionService;

    public function __construct(DeductionService $deductionService)
    {
        $this->deductionService = $deductionService;
    }
    public function index()
    {
        $query = EmployeeDeduction::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");



        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                // Search in DTR columns
                $q->where('employee_id', 'like', "%{$search}%");
                // Search in employee columns
                $q->orWhereHas('employeeBy', function ($q2) use ($search) {
                    $q2->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%");
                });
            });
        }

        $deduction = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $deduction->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $deduction->count();
        $currentPage = $deduction->currentPage();

        $employees = PersonnelEmployee::where('employment_status', 'Contractual')->orderBy('lastname', 'ASC')->get();


        return inertia("Admin/Deduction/Index", [
            "deductions" => DeductionResource::collection($deduction),
            'employees' => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(DeductionStoreRequest $request)
    {
        $dto = DeductionData::fromArray($request->validated());

        $this->deductionService->createDeduction($dto);

        return redirect()->route('deduction.index')->with([
            'success' => 'Deduction Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $deduction = $this->deductionService->getId($id);

        return response()->json($deduction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DeductionUpdateRequest $request, $id)
    {
        $dto = DeductionData::fromArray($request->validated());

        $this->deductionService->updateDeduction($dto, $id);


        return redirect()->route('deduction.index')->with([
            'success' => 'Deduction Data Updated Successfully!',
        ]);
    }
}
