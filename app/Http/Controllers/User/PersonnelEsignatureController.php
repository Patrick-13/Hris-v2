<?php

namespace App\Http\Controllers\User;

use App\DTOs\ProfileEsignature;
use App\Http\Controllers\Controller;
use App\Models\PersonnelEsignature;
use App\Services\PersonnelEsignatureService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonnelEsignatureController extends Controller
{
    protected PersonnelEsignatureService $personnel_esignature_service;

    public function __construct(PersonnelEsignatureService $personnel_esignature_service)
    {
        $this->personnel_esignature_service = $personnel_esignature_service;
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required',
            'profilePicture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'profileEsignature' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $dto = new ProfileEsignature(
            employee_id: $request->employee_id,
            profilePicture: $request->file('profilePicture'),
            profileEsignature: $request->file('profileEsignature'),
        );

        $profile = $this->personnel_esignature_service->createEsignature($dto);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    public function show($employeeId)
    {
        $profile = PersonnelEsignature::where('employee_id', $employeeId)->first();

        return response()->json([
            'profile_picture_url' => $profile?->profilePicture
                ? route('employeeprofilesignature.file', [
                    'employeeId' => $employeeId,
                    'type' => 'picture',
                ])
                : null,

            'esignature_url' => $profile?->profileEsignature
                ? route('employeeprofilesignature.file', [
                    'employeeId' => $employeeId,
                    'type' => 'signature',
                ])
                : null,
        ]);
    }
    public function file($employeeId, $type)
    {
        $profile = PersonnelEsignature::where('employee_id', $employeeId)->firstOrFail();

        $path = match ($type) {
            'picture' => $profile->profilePicture,
            'signature' => $profile->profileEsignature,
            default => abort(404),
        };

        if (!$path || !Storage::disk('network')->exists($path)) {
            abort(404);
        }

        return Storage::disk('network')->response($path);
    }
}
