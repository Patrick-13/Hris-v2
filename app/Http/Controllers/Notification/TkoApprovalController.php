<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Models\Accomplishment_approval;
use App\Models\OvertimeApproval;
use App\Models\Tko;
use App\Models\Tko_approval;
use Illuminate\Http\Request;

class TkoApprovalController extends Controller
{
    public function pendingTkoApprovals()
    {
        $employeeId = auth()->user()->employee_id;

        $pendingCount = Tko_approval::where('status', 'pending')
            ->where('approver_id', $employeeId)
            ->selectRaw('level, COUNT(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        $pendingCount = array_merge([
            'section' => 0,
            'division' => 0,
            'hr' => 0,
        ], $pendingCount);

        return response()->json([
            'pendingCount' => $pendingCount
        ]);
    }

    public function pendingTkoAdminView()
    {
        $pendingCount = Tko_approval::where('status', 'pending')
            ->selectRaw('level, COUNT(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        $pendingCount = array_merge([
            'section' => 0,
            'division' => 0,
            'hr' => 0,
        ], $pendingCount);

        return response()->json([
            'pendingCount' => $pendingCount
        ]);
    }
}
