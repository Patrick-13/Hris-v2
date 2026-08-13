<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\LeaveCreditData;
use App\Http\Controllers\Controller;
use App\Http\Requests\LeaveCreditStoreRequest;
use App\Http\Requests\LeaveCreditUpdateRequest;
use App\Http\Resources\LeaveCreditResource;
use App\Models\LeaveCredit;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use App\Services\LeaveCreditService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class LeaveCreditController extends Controller
{
    protected LeaveCreditService $leaveCreditService;

    public function __construct(LeaveCreditService $leaveCreditService)
    {
        $this->leaveCreditService = $leaveCreditService;
    }

    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user
        
        $query = LeaveCredit::with(['employeeBy', 'leaveTypeBy']);

        if (request()->filled('search')) {
            $search = request('search');

            $query->where(function ($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhereHas('employeeBy', function ($sub) use ($search) {
                        $sub->where('lastname', 'like', "%{$search}%")
                            ->orWhere('firstname', 'like', "%{$search}%");
                    })
                    ->orWhereHas('leaveTypeBy', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // ✅ If the logged-in user is not admin, filter by their employee_id
        if ($user->role !== 'admin') {
            $query->where('employee_id', $user->employee_id);
        }

        $leavecredits = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $totalCount = $leavecredits->total();
        $currentPageCount = $leavecredits->count();
        $currentPage = $leavecredits->currentPage();

        // ✅ Only load employees if admin
        $user->role === 'admin'
            ? PersonnelEmployee::all()
            : PersonnelEmployee::where('employee_id', $user->employee_id)->get();

        $leavetypes = LeaveType::all();

        $employees = PersonnelEmployee::all();

        return inertia("Admin/LeaveCredit/Index", [
            "leavecredits" => LeaveCreditResource::collection($leavecredits),
            'leavetypes' =>  $leavetypes,
            'employees' => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }


    public function store(LeaveCreditStoreRequest $request)
    {
        try {
            $dto = LeaveCreditData::fromArray($request->validated());

            $this->leaveCreditService->createLeaveCredit($dto);

            return redirect()->route('leavecredit.index')->with([
                'success' => 'Leave Credit Data Created Successfully!',
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()
                    ->withInput()
                    ->withErrors([
                        'employee_id' => 'A leave credit for this employee, leave type, and year already exists.',
                    ]);
            }

            throw $e;
        }
    }

    public function edit($id)
    {
        $leavecredit = LeaveCredit::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($leavecredit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LeaveCreditUpdateRequest $request, $id)
    {
        $dto = LeaveCreditData::fromArray($request->validated());

        $this->leaveCreditService->updateLeaveCredit($dto, $id);


        return redirect()->route('leavecredit.index')->with([
            'success' => 'Leave Credit Data Updated Successfully!',
        ]);
    }

    public function import(Request $request)
    {
        $result = $this->leaveCreditService->importLeaveCredits($request->file('leavecredit_file'));

        return redirect()->route('leavecredit.index')->with([
            'success',
            "{$result['imported']} employees imported successfully. {$result['skipped']} rows skipped."
        ]);
    }
}
