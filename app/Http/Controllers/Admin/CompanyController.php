<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\CompanyData;
use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{

    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index()
    {
        $query = Company::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $company = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $company->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $company->count();
        $currentPage = $company->currentPage();

        return inertia("Admin/Company/Index", [
            "companys" => CompanyResource::collection($company),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(CompanyStoreRequest $request)
    {
        $dto = CompanyData::fromArray($request->validated());

        $this->companyService->createCompany($dto);

        return redirect()->route('company.index')->with([
            'success' => 'Company Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $company = Company::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CompanyUpdateRequest $request, $id)
    {
        $dto = CompanyData::fromArray($request->validated());

        $this->companyService->updateCompany($dto, $id);


        return redirect()->route('company.index')->with([
            'success' => 'Company Data Updated Successfully!',
        ]);
    }
}
