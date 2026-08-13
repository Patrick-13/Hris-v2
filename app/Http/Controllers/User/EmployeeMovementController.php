<?php

namespace App\Http\Controllers\User;

use App\DTOs\EmployeeMovementData;
use App\DTOs\JobData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeMovementStoreRequest;
use App\Http\Requests\EmployeeMovementUpdateRequest;
use App\Http\Resources\EmployeeMovementResource;
use App\Models\Company;
use App\Models\Division;
use App\Models\EmployeeMovement;
use App\Models\PersonnelEmployee;
use App\Models\Position;
use App\Models\Section;
use App\Services\EmployeeMovementService;
use Illuminate\Http\Request;

class EmployeeMovementController extends Controller
{
    protected EmployeeMovementService $employeeMovementService;

    public function __construct(EmployeeMovementService $employeeMovementService)
    {
        $this->employeeMovementService = $employeeMovementService;
    }

    public function index()
    {
        $query = EmployeeMovement::with(['employeeBy', 'divisionBy', 'sectionBy']);

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->orWhereHas('employeeBy', function ($sub) use ($search) {
                    $sub->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%");
                })
                    ->orWhereHas('divisionBy', function ($sub) use ($search) {
                        $sub->where('div_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('sectionBy', function ($sub) use ($search) {
                        $sub->where('sec_name', 'like', "%{$search}%");
                    });;
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $employeemovement = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $employeemovement->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $employeemovement->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $employeemovement->count();
        $currentPage = $employeemovement->currentPage();

        $companys = Company::all();
        $personelemployees = PersonnelEmployee::orderBy('lastname', 'asc')->get();
        $divisions = Division::orderBy('div_name', 'asc')->get();
        $sections = Section::orderBy('sec_name', 'asc')->get();
        $positions = Position::orderBy('post_name', 'asc')->get();

        return inertia("Admin/EmployeeMovement/Index", [
            "employeemovements" => EmployeeMovementResource::collection($employeemovement),
            "companys" => $companys,
            "personelemployees" => $personelemployees,
            "divisions" => $divisions,
            "sections" => $sections,
            "positions" => $positions,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(EmployeeMovementStoreRequest $request)
    {
        $dto = EmployeeMovementData::fromArray($request->validated());
        $dtojob = JobData::fromArray($request->validated());

        $this->employeeMovementService->createEmployeeMovement($dto, $dtojob);

        return redirect()->route('employeemovement.index')->with([
            'success' => 'Employee Movement Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $employeemovement = EmployeeMovement::with('employeeBy.employeeJobBy')
            ->findOrFail($id);

        return response()->json($employeemovement);
    }


    public function update(EmployeeMovementUpdateRequest $request, $id)
    {
        $dto = EmployeeMovementData::fromArray($request->validated());
        $dtojob = JobData::fromArray($request->validated());


        $this->employeeMovementService->updateEmployeeMovement($dto, $dtojob, $id);


        return redirect()->route('employeemovement.index')->with([
            'success' => 'Employee Movement Data Updated Successfully!',
        ]);
    }
}
