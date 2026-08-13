<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayrollResource;
use App\Models\Payroll;
use App\Models\PersonnelEmployee;
use Illuminate\Http\Request;

class MyPayrollController extends Controller
{
    public function index()
    {
        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Payroll::where('status', 'approved');

        if ($dateFrom && $dateTo) {
            $query->whereDate('payroll_from', '>=', $dateFrom)
                ->whereDate('payroll_to', '<=', $dateTo);
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $query->where("employee_id", auth()->user()->employee_id);

        $payroll = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $payroll->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $payroll->count();
        $currentPage = $payroll->currentPage();

        $employees = PersonnelEmployee::orderBy('lastname', 'ASC')->get();

        return inertia("User/Payroll/Index", [
            "payrolls" => PayrollResource::collection($payroll),
            'queryParams' => request()->query() ?: null,
            "employees" => $employees,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
}
