<?php

namespace App\Http\Controllers\User;

use App\DTOs\TkoData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TkoStoreRequest;
use App\Http\Requests\TkoUpdateRequest;
use App\Http\Resources\TkoResource;
use App\Models\PersonnelEmployee;
use App\Models\Tko;
use App\Services\TkoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MyTkoController extends Controller
{
    protected TkoService $tkoService;

    public function __construct(TkoService $tkoService)
    {
        $this->tkoService = $tkoService;
    }

    public function index(Request $request)
    {
        $employeeId = Auth::user()->employee_id;

        $query = Tko::with('employeeBy')->where(function ($q) use ($employeeId) {
            $q->where('employee_id', $employeeId);
        });

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $tkos = $query
            ->with(['employeeBy', 'approvals.approver']) // ✅ eager load relations
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $tkos->appends(request()->only(['sort_field', 'sort_direction']));

        $now = now();

        if ($now->month <= 6) {
            // Current semester: January - June
            $semesterStart = $now->copy()->startOfYear();
            $semesterEnd = $now->copy()->month(6)->endOfMonth();

            // Previous semester: July - December (previous year)
            $previousSemesterStart = $now->copy()->subYear()->month(7)->startOfMonth();
            $previousSemesterEnd = $now->copy()->subYear()->endOfYear();
        } else {
            // Current semester: July - December
            $semesterStart = $now->copy()->month(7)->startOfMonth();
            $semesterEnd = $now->copy()->endOfYear();

            // Previous semester: January - June (same year)
            $previousSemesterStart = $now->copy()->startOfYear();
            $previousSemesterEnd = $now->copy()->month(6)->endOfMonth();
        }

        $currentSemesterCount = Tko::where('employee_id', $employeeId)
            ->whereBetween('date', [$semesterStart, $semesterEnd])
            ->whereHas('approvals', function ($q) {
                $q->where('level', 'hr')
                    ->where('status', 'approved');
            })
            ->count();

        $previousSemesterCount = Tko::where('employee_id', $employeeId)
            ->whereBetween('date', [$previousSemesterStart, $previousSemesterEnd])
            ->whereHas('approvals', function ($q) {
                $q->where('level', 'hr')
                    ->where('status', 'approved');
            })
            ->count();

        $tkos->getCollection()->transform(function ($tko) use (
            $currentSemesterCount,
            $previousSemesterCount,
            $semesterStart,
            $semesterEnd
        ) {
            $tkoDate = \Carbon\Carbon::parse($tko->date);

            if ($tkoDate->between($semesterStart, $semesterEnd)) {
                $tko->tko_count = $currentSemesterCount;
            } else {
                $tko->tko_count = $previousSemesterCount;
            }

            $tko->tko_remaining = max(0, 3 - $tko->tko_count);

            return $tko;
        });

        $tkos->appends(
            $request->only([
                'sort_field',
                'sort_direction',
                'search'
            ])
        );

        $totalCount = $tkos->total();
        $currentPageCount = $tkos->count();
        $currentPage = $tkos->currentPage();

        $employees = PersonnelEmployee::orderBy('lastname', 'ASC')->get();

        return inertia("User/MyTko/Index", [
            "tkos" => TkoResource::collection($tkos),
            'queryParams' => request()->query() ?: null,
            "employees" => $employees,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(TkoStoreRequest $request)
    {
        $dto = TkoData::fromArray($request->validated());

        $this->tkoService->store($dto);

        return redirect()->back()->with(['success' => 'Tko data Created successfully.']);
    }

    public function edit($id)
    {
        $training = $this->tkoService->getId($id);

        return response()->json($training);
    }

    public function update(TkoUpdateRequest $request, $id)
    {

        $dto = TkoData::fromArray($request->validated());

        $this->tkoService->updateTko($dto, $id);

        return redirect()->back()->with(['success' => 'Tko data updated successfully.']);
    }

    public function approve(Request $request, $id)
    {
        $this->tkoService->approveTko($id, $request->input('status'), $request->input('remarks'));

        return redirect()->route('mytko.index')->with([
            'success' => 'Tko approved successfully!',
        ]);
    }

    public function show($id)
    {
        $tko = Tko::findOrFail($id);
        // or just find($id) if you don’t want it to 404

        return response()->json($tko);
    }


    public function showFile($filename)
    {
        return $this->tkoService->showFile($filename);
    }
}
