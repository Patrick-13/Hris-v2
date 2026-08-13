<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Division;

class OrgchartController extends Controller
{
    public function index()
    {
        $divisions = Division::with([
            'employeeBy', // 👈 division supervisor
            'sections.employeeBy', // 👈 section supervisor
            'sections.positions.movements.employeeBy'
        ])->get();


        return inertia("Admin/Orgchart/Index", [
            "divisions" => $divisions
        ]);
    }
}
