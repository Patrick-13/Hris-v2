<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CocCreditResource;
use App\Models\Coc_credit;
use App\Models\PersonnelEmployee;
use Illuminate\Http\Request;

class CocCreditController extends Controller
{
    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user
        $query = Coc_credit::with('employeeBy');

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhere('leave_type_id', 'like', "%{$search}%")
                    ->orWhereHas('employeeBy', function ($sub) use ($search) {
                        $sub->where('lastname', 'like', "%{$search}%")
                            ->orWhere('firstname', 'like', "%{$search}%");
                    });
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // ✅ If the logged-in user is not admin, filter by their employee_id
        if ($user->role !== 'admin') {
            $query->where('employee_id', $user->employee_id);
        }

        $coccredits = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $totalCount = $coccredits->total();
        $currentPageCount = $coccredits->count();
        $currentPage = $coccredits->currentPage();

        // ✅ Only load employees if admin
        $user->role === 'admin'
            ? PersonnelEmployee::all()
            : PersonnelEmployee::where('employee_id', $user->employee_id)->get();

     
        $employees = PersonnelEmployee::all();

        return inertia("Admin/CocCredit/Index", [
            "coccredits" => CocCreditResource::collection($coccredits),
            'employees' => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
}
