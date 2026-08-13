<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelOvertimeResource;
use App\Models\Personnelovertime;
use Illuminate\Http\Request;

class RaroController extends Controller
{

    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user


        $query = Personnelovertime::with('employeeBy');

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

        $personnelovertime = $query
            ->with(['employeeBy', 'approvals.approver', 'accomplishments.approvals',]) // ✅ eager load relations
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $personnelovertime->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $personnelovertime->total();
        $currentPageCount = $personnelovertime->count();
        $currentPage = $personnelovertime->currentPage();

        return inertia("Admin/PersonnelOvertime/Index", [
            "personnelovertimes" => PersonnelOvertimeResource::collection($personnelovertime),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
}
