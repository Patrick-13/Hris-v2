<?php

namespace App\Http\Controllers\User;

use App\DTOs\TkoData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TkoStoreRequest;
use App\Http\Requests\TkoUpdateRequest;
use App\Http\Requests\TrainingUpdateRequest;
use App\Http\Resources\TkoResource;
use App\Models\PersonnelEmployee;
use App\Models\Tko;
use App\Services\TkoService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TkoController extends Controller
{
    protected TkoService $tkoService;

    public function __construct(TkoService $tkoService)
    {
        $this->tkoService = $tkoService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Tko::with([
            'employeeBy',
            'approvals.approver'
        ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('employeeBy', function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Non-admin users only see records they approve
        if ($user->role !== 'admin') {
            $query->whereHas('approvals', function ($subQuery) use ($user) {
                $subQuery->where('approver_id', $user->employee_id);
            })
                ->where('employee_id', '!=', $user->employee_id);
        }
        $pendingQuery = clone $query;
        $approvedQuery = clone $query;
        $waitingQuery = clone $query;
        $rejectedQuery = clone $query;

        //pending query
        $tkopending = $pendingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'Pending')
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

        $tkopending->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'pending_page', // preserve the other paginator
            ])
        );

        //waiting query
        $tkowaiting = $waitingQuery
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

        $tkowaiting->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'waiting_page', // preserve the other paginator
            ])
        );

        //approved query
        $tkoapproved = $approvedQuery
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

        $tkoapproved->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'approved_page', // preserve the other paginator
            ])
        );

        //rejected query
        $tkorejected = $rejectedQuery
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

        $tkorejected->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'rejected_page', // preserve the other paginator
            ])
        );


        // Get approved TKO count per employee
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

        $currentSemesterCounts = Tko::whereBetween('date', [$semesterStart, $semesterEnd])
            ->whereHas('approvals', function ($q) {
                $q->where('level', 'hr')
                    ->where('status', 'approved');
            })
            ->get()
            ->groupBy('employee_id')
            ->map(fn($tkos) => $tkos->count());

        $previousSemesterCounts = Tko::whereBetween('date', [$previousSemesterStart, $previousSemesterEnd])
            ->whereHas('approvals', function ($q) {
                $q->where('level', 'hr')
                    ->where('status', 'approved');
            })
            ->get()
            ->groupBy('employee_id')
            ->map(fn($tkos) => $tkos->count());
        // Attach count to each TKO record

        $tkopending->getCollection()->transform(function ($tko) use (
            $currentSemesterCounts,
            $previousSemesterCounts,
            $semesterStart,
            $semesterEnd
        ) {
            $tkoDate = Carbon::parse($tko->date);

            $currentCount = $currentSemesterCounts[$tko->employee_id] ?? 0;
            $previousCount = $previousSemesterCounts[$tko->employee_id] ?? 0;

            if ($tkoDate->between($semesterStart, $semesterEnd)) {
                $count = $currentCount;
            } else {
                $count = $previousCount;
            }

            $tko->tko_count = $count;
            $tko->tko_remaining = max(0, 3 - $count);

            return $tko;
        });

        $tkowaiting->getCollection()->transform(function ($tko) use (
            $currentSemesterCounts,
            $previousSemesterCounts,
            $semesterStart,
            $semesterEnd
        ) {
            $tkoDate = Carbon::parse($tko->date);

            $currentCount = $currentSemesterCounts[$tko->employee_id] ?? 0;
            $previousCount = $previousSemesterCounts[$tko->employee_id] ?? 0;

            if ($tkoDate->between($semesterStart, $semesterEnd)) {
                $count = $currentCount;
            } else {
                $count = $previousCount;
            }

            $tko->tko_count = $count;
            $tko->tko_remaining = max(0, 3 - $count);

            return $tko;
        });

        $tkoapproved->getCollection()->transform(function ($tko) use (
            $currentSemesterCounts,
            $previousSemesterCounts,
            $semesterStart,
            $semesterEnd
        ) {
            $tkoDate = Carbon::parse($tko->date);

            $currentCount = $currentSemesterCounts[$tko->employee_id] ?? 0;
            $previousCount = $previousSemesterCounts[$tko->employee_id] ?? 0;

            if ($tkoDate->between($semesterStart, $semesterEnd)) {
                $count = $currentCount;
            } else {
                $count = $previousCount;
            }

            $tko->tko_count = $count;
            $tko->tko_remaining = max(0, 3 - $count);

            return $tko;
        });

        $tkorejected->getCollection()->transform(function ($tko) use (
            $currentSemesterCounts,
            $previousSemesterCounts,
            $semesterStart,
            $semesterEnd
        ) {
            $tkoDate = Carbon::parse($tko->date);

            $currentCount = $currentSemesterCounts[$tko->employee_id] ?? 0;
            $previousCount = $previousSemesterCounts[$tko->employee_id] ?? 0;

            if ($tkoDate->between($semesterStart, $semesterEnd)) {
                $count = $currentCount;
            } else {
                $count = $previousCount;
            }

            $tko->tko_count = $count;
            $tko->tko_remaining = max(0, 3 - $count);

            return $tko;
        });



        $employees = PersonnelEmployee::orderBy('lastname', 'ASC')->get();

        return inertia('User/Tko/Index', [
            'tkos' => TkoResource::collection($tkopending),
            'tkowaiting' => TkoResource::collection($tkowaiting),
            'tkoapproved' => TkoResource::collection($tkoapproved),
            'tkorejected' => TkoResource::collection($tkorejected),
            'queryParams' => $request->query() ?: null,
            'employees' => $employees,
            'success' => session('success'),
            //fetch tko pending
            'totalCount' => $tkopending->total(),
            'currentPageCount' => $tkopending->count(),
            'currentPage' => $tkopending->currentPage(),
            //fetch tko waiting
            'totalCountwaiting' => $tkowaiting->total(),
            'currentPageCountwaiting' => $tkowaiting->count(),
            'currentPagewaiting' => $tkowaiting->currentPage(),

            //fetch tko approved
            'totalCountapproved' => $tkoapproved->total(),
            'currentPageCountapproved' => $tkoapproved->count(),
            'currentPageapproved' => $tkoapproved->currentPage(),

            //fetch tko rejected
            'totalCountrejected' => $tkorejected->total(),
            'currentPageCountrejected' => $tkorejected->count(),
            'currentPagerejected' => $tkorejected->currentPage(),
        ]);
    }

    public function approve(Request $request, $id)
    {
        $status = $request->input('status');
        $remarks = $request->input('remarks');

        // dd($remarks);

        $this->tkoService->approveTko($id, $status, $remarks);

        $message = match ($status) {
            'approved' => 'TKO approved successfully!',
            'rejected' => 'TKO rejected successfully!',
            'pending' => 'TKO returned to pending.',
            default => 'TKO updated successfully!',
        };

        return redirect()->route('tko.index')->with('success', $message);
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
