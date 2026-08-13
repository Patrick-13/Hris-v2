<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TkoResource;
use App\Models\PersonnelEmployee;
use App\Models\Tko;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TkoController extends Controller
{
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

        $tkos = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);


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

        $tkos->getCollection()->transform(function ($tko) use (
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


        $tkos->appends(
            $request->only([
                'sort_field',
                'sort_direction',
                'search'
            ])
        );

        $employees = PersonnelEmployee::orderBy('lastname', 'ASC')->get();

        return inertia('Admin/Tko/Index', [
            'tkos' => TkoResource::collection($tkos),
            'queryParams' => $request->query() ?: null,
            'employees' => $employees,
            'success' => session('success'),

            'totalCount' => $tkos->total(),
            'currentPageCount' => $tkos->count(),
            'currentPage' => $tkos->currentPage(),
        ]);
    }
}
