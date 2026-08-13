<?php

namespace App\Http\Controllers\User;

use App\DTOs\TrainingData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TrainingStoreRequest;
use App\Http\Requests\TrainingUpdateRequest;
use App\Http\Resources\PersonnelTrainingResource;
use App\Models\Division;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelTraining;
use App\Models\Section;
use App\Services\PersonnelTrainingService;

class TrainingController extends Controller
{
    protected PersonnelTrainingService $personnelTrainingService;

    public function __construct(PersonnelTrainingService $personnelTrainingService)
    {
        $this->personnelTrainingService = $personnelTrainingService;
    }

    public function index()
    {
        $query = PersonnelTraining::with('employees');

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('soNumber', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            });
        }
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $training = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $training->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $employeeQuery = PersonnelEmployee::with('movement')
            ->where('emp_status', 0);

        if (request()->filled('search')) {
            $search = request('search');
            $employeeQuery->where(function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        // Filter employees by division
        if (request()->filled('division_id')) {
            $employeeQuery->whereHas('movement', function ($q) {
                $q->where('division_id', request('division_id'));
            });
        }

        // Filter employees by section
        if (request()->filled('section_id')) {
            $employeeQuery->whereHas('movement', function ($q) {
                $q->where('section_id', request('section_id'));
            });
        }

        if (request()->filled('status')) {
            $employeeQuery->where('employment_status', request('status'));
        }


        $employees = $employeeQuery->get();

        $totalCount = $training->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $training->count();
        $currentPage = $training->currentPage();

        $divisions = Division::all();
        $sections = Section::all();

        return inertia("Admin/Training/Index", [
            "trainings" => PersonnelTrainingResource::collection($training),
            'trainingemployees' => $employees,
            'divisions' => $divisions,
            'sections' => $sections,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(TrainingStoreRequest $request)
    {
        $dto = TrainingData::fromArray($request->validated());

        $this->personnelTrainingService->createTraining($dto);

        return redirect()->back()->with(['success' => 'Training data Created successfully.']);
    }

    public function edit($id)
    {
        $training = $this->personnelTrainingService->getId($id);

        return response()->json($training);
    }

    public function show($id)
    {
        $showtraining = $this->personnelTrainingService->getId($id);

        return response()->json($showtraining);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TrainingUpdateRequest $request, $id)
    {
        $dto = TrainingData::fromArray($request->validated());

        $this->personnelTrainingService->updateTraining($dto, $id);

        return redirect()->back()->with(['success' => 'Training data updated successfully.']);
    }

    public function learningreport($id)
    {
        $showtraining = $this->personnelTrainingService->getId($id); // or just find($id) if you don’t want it to 404

        return response()->json($showtraining);
    }
}
