<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelOvertimeResource;
use App\Models\Personnelovertime;
use App\Services\EmployeeOvertimeService;
use App\Services\OvertimeAccomplishmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeOvertimeController extends Controller
{
    protected EmployeeOvertimeService $employeeOvertimeService;
    protected OvertimeAccomplishmentService $overtimeAccomplishmentService;

    public function __construct(EmployeeOvertimeService $employeeOvertimeService, OvertimeAccomplishmentService $overtimeAccomplishmentService)
    {
        $this->employeeOvertimeService = $employeeOvertimeService;
        $this->overtimeAccomplishmentService = $overtimeAccomplishmentService;
    }

    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user


        $query = Personnelovertime::with([
            'employeeBy',
            'approvals.approver',
            'accomplishments.approvals',
        ]);

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->orWhereHas('employeeBy', function ($sub) use ($search) {
                    $sub->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // ✅ If the logged-in user is not admin, filter by their employee_id
        if ($user->role !== 'admin') {
            $query->whereHas('approvals', function ($subQuery) use ($user) {
                $subQuery->where('approver_id', $user->employee_id);
            })
                ->where('employee_id', '!=', $user->employee_id); // ← exclude own leave
        }

        $pendingQuery = clone $query;
        $approvedQuery = clone $query;
        $waitingQuery = clone $query;
        $rejectedQuery = clone $query;
        $returnedQuery = clone $query;


        //pending query
        $raropending = $pendingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'pending')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'pending_page'
            )
            ->onEachSide(1);

        $raropending->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'pending_page', // preserve the other paginator
            ])
        );

        //waiting query
        $rarowaiting = $waitingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'waiting')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'waiting_page'
            )
            ->onEachSide(1);

        $rarowaiting->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'waiting_page', // preserve the other paginator
            ])
        );

        //approved query
        $raroapproved = $approvedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'approved_page'
            )
            ->onEachSide(1);

        $raroapproved->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'approved_page', // preserve the other paginator
            ])
        );

        //rejected query
        $rarorejected = $rejectedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'rejected')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'rejected_page'
            )
            ->onEachSide(1);

        $rarorejected->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'rejected_page', // preserve the other paginator
            ])
        );

        //returned query
        $raroreturned = $returnedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'returned')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'returned_page'
            )
            ->onEachSide(1);

        $raroreturned->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'returned_page', // preserve the other paginator
            ])
        );

        $totalCount = $raropending->total();
        $currentPageCount = $raropending->count();
        $currentPage = $raropending->currentPage();

        $totalCountwaiting = $rarowaiting->total();
        $currentPageCountwaiting = $rarowaiting->count();
        $currentPagewaiting = $rarowaiting->currentPage();

        $totalCountapproved = $raroapproved->total();
        $currentPageCountapproved = $raroapproved->count();
        $currentPageapproved = $raroapproved->currentPage();

        $totalCountrejected = $rarorejected->total();
        $currentPageCountrejected = $rarorejected->count();
        $currentPagerejected = $rarorejected->currentPage();

        $totalCountreturned = $raroreturned->total();
        $currentPageCountreturned = $raroreturned->count();
        $currentPagereturned = $raroreturned->currentPage();

        return inertia("User/PersonnelOvertime/Index", [
            "personnelovertimes" => PersonnelOvertimeResource::collection($raropending),
            "personnelovertimewaiting" => PersonnelOvertimeResource::collection($rarowaiting),
            "personnelovertimeapproved" => PersonnelOvertimeResource::collection($raroapproved),
            "personnelovertimerejected" => PersonnelOvertimeResource::collection($rarorejected),
            "personnelovertimereturned" => PersonnelOvertimeResource::collection($raroreturned),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,

            'totalCountwaiting' => $totalCountwaiting,
            'currentPageCountwaiting' => $currentPageCountwaiting,
            'currentPagewaiting' => $currentPagewaiting,

            'totalCountapproved' => $totalCountapproved,
            'currentPageCountapproved' => $currentPageCountapproved,
            'currentPageapproved' => $currentPageapproved,

            'totalCountrejected' => $totalCountrejected,
            'currentPageCountrejected' => $currentPageCountrejected,
            'currentPagerejected' => $currentPagerejected,

            'totalCountreturned' => $totalCountreturned,
            'currentPageCountreturned' => $currentPageCountreturned,
            'currentPagereturned' => $currentPagereturned,
        ]);
    }


    public function show($id)
    {
        $employeeovertime = Personnelovertime::findOrFail($id);
        // or just find($id) if you don’t want it to 404

        return response()->json($employeeovertime);
    }

    public function approve(Request $request, $id)
    {
        $status = $request->input('status');
        $remarks = $request->input('remarks');
        // Get the updated approval from the service
        $this->employeeOvertimeService->approveOvertime(
            $id,
            $status,
            $remarks
        );

        return redirect()->route('employeeovertime.index')->with([
            'success' => 'Overtime approved successfully!',
        ]);
    }


    public function bulkApprove(Request $request)
    {
     
        $remarks = $request->input('remarks');

        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:personnelovertimes,id',
        ]);

        DB::transaction(function () use ($validated, $remarks) {
            foreach ($validated['ids'] as $overtimeId) {
                // approve only at current user's level
                $this->employeeOvertimeService->approveOvertime($overtimeId, 'approved', $remarks);
            }
        });

        return back()->with([
            'success' => 'Selected overtime requests approved at your level.',
        ]);
    }
}
