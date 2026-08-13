<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Device;
use App\Models\Downloadableform;
use App\Models\Dtr;
use App\Models\LeaveCredit;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        $activities = Activity::where('soNumber', 'like', "%$query%")
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => 'Activity',
                    'label' => $activity->soNumber,
                    'url' => route('activity.index', ['search' => $activity->soNumber])
                ];
            });

        $dtrs = Dtr::where('employee_id', 'like', "%$query%")
            ->distinct()
            ->pluck('employee_id')   // only get unique employee IDs
            ->map(function ($employee_id) {
                return [
                    'type'  => 'Dtr',
                    'label' => $employee_id,
                    'url'   => route('dtr.index', ['search' => $employee_id])
                ];
            });



        $downloadableforms = Downloadableform::where('name', 'like', "%$query%")
            ->distinct()
            ->pluck('name')   // only get unique employee IDs
            ->map(function ($name) {
                return [
                    'type'  => 'Downloadable Form',
                    'label' => $name,
                    'url'   => route('downloadform.index', ['search' => $name])
                ];
            });

        $devices = Device::where('property_number', 'like', "%$query%")
            ->distinct()
            ->pluck('property_number')   // only get unique employee IDs
            ->map(function ($property_number) {
                return [
                    'type'  => 'Device',
                    'label' => $property_number,
                    'url'   => route('device.index', ['search' => $property_number])
                ];
            });

        $employees = PersonnelEmployee::where('firstname', 'like', "%$query%")
            ->orWhere('lastname', 'like', "%$query%")
            ->get()
            ->map(function ($emp) {
                return [
                    'type' => 'Employee',
                    'label' => $emp->firstname . " " . $emp->lastname,
                    'url' => route('employee.index', ['search' => $emp->employee_id])
                ];
            });

        $leavecredits = LeaveCredit::where('employee_id', 'like', "%$query%")
            ->distinct()
            ->pluck('employee_id')   // only get unique employee IDs
            ->map(function ($employee_id) {
                return [
                    'type'  => 'Leave Credit',
                    'label' => $employee_id,
                    'url'   => route('leavecredit.index', ['search' => $employee_id])
                ];
            });

        $personelLeaves = PersonnelLeave::where('employee_id', 'like', "%$query%")
            ->distinct()
            ->pluck('employee_id')   // only get unique employee IDs
            ->map(function ($employee_id) {
                return [
                    'type'  => 'Leave Status',
                    'label' => $employee_id,
                    'url'   => route('employeeleave.index', ['search' => $employee_id])
                ];
            });


        return response()->json([
            'results' => [
                ...$activities,
                ...$devices,
                ...$dtrs,
                ...$downloadableforms,
                ...$employees,
                ...$leavecredits,
                ...$personelLeaves,
            ]
        ]);
    }
}
