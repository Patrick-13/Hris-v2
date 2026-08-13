<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Models\Accomplishment_approval;
use App\Models\OvertimeApproval;
use Illuminate\Http\Request;

class OvertimeApprovalController extends Controller
{
    public function pendingRAROApprovals()
    {
        $employeeId = auth()->user()->employee_id;

        $pendingCount = OvertimeApproval::where('status', 'pending')
            ->where('approver_id', $employeeId)
            ->selectRaw('level, COUNT(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();
        
        $pendingCount = array_merge([
            'section' => 0,
            'division' => 0,
            'finance' => 0,
            'regional' => 0,
        ], $pendingCount);

        return response()->json([
            'pendingCount' => $pendingCount
        ]);
    }

    public function pendingAROApprovals()
    {
        $employeeId = auth()->user()->employee_id;

        $pendingAroCount = Accomplishment_approval::where('status', 'pending')
            ->where('approver_id', $employeeId)
            ->selectRaw('level, COUNT(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        $pendingAroCount = array_merge([
            'section' => 0,
            'division' => 0,
            'finance' => 0,
            'regional' => 0,
        ], $pendingAroCount);

        return response()->json([
            'pendingAroCount' => $pendingAroCount
        ]);
    }
}
