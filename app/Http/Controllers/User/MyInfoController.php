<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\PersonnelEmployee;
use App\Services\MyInfoServices;
use Illuminate\Support\Facades\Auth;

class MyInfoController extends Controller
{

    protected MyInfoServices $myInfoServices;

    public function __construct(MyInfoServices $myInfoServices)
    {
        $this->myInfoServices = $myInfoServices;
    }
    public function index()
    {
        $query = PersonnelEmployee::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $query->where("employee_id", auth()->user()->employee_id);

        $employeeinfo = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $employeeinfo->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $employeeinfo->count();
        $currentPage = $employeeinfo->currentPage();

        $employeeId = Auth::user()->employee_id;

        $personnelLeave =  $this->myInfoServices->getPersonnelLeaves($employeeId);

        return inertia("MyInfo/Index", [
            "employeeinfos" => PersonnelEmployeeResource::collection($employeeinfo),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            "personnelLeave" => $personnelLeave,
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
}
