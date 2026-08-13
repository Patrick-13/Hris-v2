<?php

namespace App\Http\Controllers\Notification;


use App\Http\Controllers\Controller;
use App\Models\LeaveApproval;
use Illuminate\Http\Request;

class LeaveApprovalController extends Controller
{
    public function notification()
    {
        $userEmployeeId = auth()->user()->employee_id;

        $pendingLeaveCount = LeaveApproval::where('approver_id', $userEmployeeId)
            ->where('status', 'pending')
            ->selectRaw('level, count(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        // Ensure both levels exist with default 0
        $pendingLeaveCount = array_merge([
            'section' => 0,
            'division' => 0,
            'finance' => 0,
            'regional' => 0,
        ], $pendingLeaveCount);

        return response()->json([
            'pendingLeaveCount' => $pendingLeaveCount
        ]);
    }
}
