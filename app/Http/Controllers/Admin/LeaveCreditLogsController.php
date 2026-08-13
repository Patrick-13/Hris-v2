<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaveCreditLogsResource;
use App\Models\LeaveCreditLog;
use Illuminate\Http\Request;

class LeaveCreditLogsController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $query = LeaveCreditLog::with(['employee', 'leaveType']);

        if (request()->filled('search')) {
            $search = request('search');

            $query->where(function ($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhere('month', 'like', "%{$search}%")
                    ->orWhere('earned', 'like', "%{$search}%")
                    ->orWhereHas('employee', function ($sub) use ($search) {
                        $sub->where('lastname', 'like', "%{$search}%")
                            ->orWhere('firstname', 'like', "%{$search}%")
                            ->orWhere('employee_id', 'like', "%{$search}%");
                    })
                    ->orWhereHas('leaveTypeBy', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        // Restrict non-admin users to their own logs
        if ($user->role !== 'admin') {
            $query->where('employee_id', $user->employee_id);
        }

        $leavecreditlogs = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        return inertia('Admin/LeaveCreditLog/Index', [
            'leavecreditlogs'      => LeaveCreditLogsResource::collection($leavecreditlogs),
            'queryParams'       => request()->query() ?: null,
            'success'           => session('success'),
            'totalCount'        => $leavecreditlogs->total(),
            'currentPageCount'  => $leavecreditlogs->count(),
            'currentPage'       => $leavecreditlogs->currentPage(),
        ]);
    }
}
