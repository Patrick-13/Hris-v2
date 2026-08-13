<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayrollResource;
use App\Models\Payroll;
use App\Models\PersonnelEmployee;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{

    protected PayrollService $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }


    public function index()
    {
        $dateFrom = request('date_from');
        $dateTo = request('date_to');


        $query = Payroll::with(['deductions', 'employeeBy']);

        if ($dateFrom && $dateTo) {
            $query->whereDate('payroll_from', '>=', $dateFrom)
                ->whereDate('payroll_to', '<=', $dateTo);
        }

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                // Search in DTR columns
                $q->where('employee_id', 'like', "%{$search}%");
                // Search in employee columns
                $q->orWhereHas('employeeBy', function ($q2) use ($search) {
                    $q2->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%");
                });
            });
        }


        if (request()->filled('status')) {
            $status = request('status');
            $query->where(function ($q) use ($status) {
                $q->orWhereHas('employeeBy', function ($q2) use ($status) {
                    $q2->where('employment_status', $status);
                });
            });
        }


        if (request()->filled('payroll_status')) {
            $payrollstatus = request('payroll_status');
            $query->where('status', $payrollstatus);
        }



        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $payroll = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        try {
            $perPage = request()->input('per_page', 20);
            if (!in_array($perPage, [20, 50, 100, 150])) {
                $perPage = 10; // Default to 10 if an invalid value is provided
            }

            $payroll = $query->orderBy($sortField, $sortDirection)->paginate($perPage)->onEachSide(1);

            $payroll->appends(request()->only(['date_from', 'date_to', 'search', 'status', 'per_page', 'sort_field', 'sort_direction']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error processing request.'], 500);
        }

        $totalCount = $payroll->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $payroll->count();
        $currentPage = $payroll->currentPage();

        $employees = PersonnelEmployee::orderBy('lastname', 'ASC')->get();

        return inertia("Admin/Payroll/Index", [
            "payrolls" => PayrollResource::collection($payroll),
            'queryParams' => request()->query() ?: null,
            "employees" => $employees,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
    public function generate(Request $request)
    {
        $request->validate([
            'date_from'   => 'required|date',
            'date_to'     => 'required|date',
            'status'      =>  'required',
        ]);

        $dateFrom   = $request->date_from;
        $dateTo     = $request->date_to;
        $status     = $request->status;

        $this->payrollService->generatePayroll(
            $dateFrom,
            $dateTo,
            $status,
        );

        return redirect()->route('payroll.index')
            ->with('success', 'Payroll generated successfully.');
    }

    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:payrolls,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $payrollId) {
                // approve only at current user's level
                $this->payrollService->updateStatus($payrollId, 'approved');
            }
        });

        return back()->with([
            'success' => 'Selected Payroll requests updated Successfully!',
        ]);
    }
}
