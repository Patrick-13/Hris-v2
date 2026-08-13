<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\IclockTransactionResource;
use App\Models\IclockTransaction;
use Illuminate\Http\Request;

class IclockTransactionController extends Controller
{
    public function Index()
    {
        $query = IclockTransaction::with('employee_transaction');


        // Filter by employee name
        if (request()->filled('search')) {
            $employeeName = request('search');
            $query->whereHas('employee_transaction', function ($q) use ($employeeName) {
                $q->where(function ($q2) use ($employeeName) {
                    $q2->where('employee_id', $employeeName)
                        ->orWhere('first_name', 'LIKE', '%' . $employeeName . '%')
                        ->orWhere('last_name', 'LIKE', '%' . $employeeName . '%');
                });
            });
        }


        $sortField = request("sort_field", "punch_time");
        $sortDirection = request("sort_direction", "desc");

        $transactions = $query->orderBy($sortField, $sortDirection)->paginate(50)->onEachSide(1);



        try {
            $perPage = request()->input('per_page', 50);
            if (!in_array($perPage, [50, 100, 150, 200])) {
                $perPage = 10; // Default to 10 if an invalid value is provided
            }

            $transactions = $query->orderBy($sortField, $sortDirection)->paginate($perPage)->onEachSide(1);

            $transactions->appends(request()->only(['dateFrom', 'dateTo', 'per_page', 'punchstate', 'sort_field', 'sort_direction']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error processing request.'], 500);
        }
        $transactions->appends(request()->only(['search', 'sort_field', 'sort_direction']));
        $totalCount = $transactions->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $transactions->count();
        $currentPage = $transactions->currentPage();


        return inertia("Guest/Iclocktransaction", [
            "transactions" => IclockTransactionResource::collection($transactions),
            'queryParams' => request()->query() ?: null,
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
            'success' => session('success'),
        ]);
    }
}
