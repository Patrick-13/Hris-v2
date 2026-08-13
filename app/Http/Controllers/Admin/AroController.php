<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OvertimeAccomplishmentResource;
use App\Http\Resources\PersonnelOvertimeResource;
use App\Models\Overtime_accomplishment;
use App\Models\Personnelovertime;
use Illuminate\Http\Request;

class AroController extends Controller
{
    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user


        $query = Overtime_accomplishment::with(['overtime.employeeBy', 'approvals.approver']);

        if (request()->filled('search')) {
            $search = request('search');

            $query->whereHas('overtime.employeeBy', function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if ($user->role !== 'admin') {
            $query->whereHas('approvals', function ($q) use ($user) {
                $q->where('approver_id', $user->employee_id);
            });

            $query->whereHas('overtime', function ($q) use ($user) {
                $q->where('employee_id', '!=', $user->employee_id);
            });
        }


        $personnelaccomplishment = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $personnelaccomplishment->appends(
            request()->only(['search', 'sort_field', 'sort_direction'])
        );

        $personnelaccomplishment->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $personnelaccomplishment->total();
        $currentPageCount = $personnelaccomplishment->count();
        $currentPage = $personnelaccomplishment->currentPage();

        return inertia("Admin/Aro/Index", [
            "personnelaccomplishments" => OvertimeAccomplishmentResource::collection($personnelaccomplishment),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function showaccomplishment($id)
    {
        $employeeovertime = Personnelovertime::with([
            'accomplishments.approvals',
            'accomplishments.overtime',
            'approvals',
            'employeeBy',
        ])->where('id', $id)->get();


        return PersonnelOvertimeResource::collection($employeeovertime);
    }
}
