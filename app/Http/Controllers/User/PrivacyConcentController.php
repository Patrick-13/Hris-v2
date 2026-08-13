<?php

namespace App\Http\Controllers\User;

use App\DTOs\PrivacyConcentData;
use App\Http\Controllers\Controller;
use App\Services\PrivacyConsentService;
use Illuminate\Http\Request;

class PrivacyConcentController extends Controller
{
    public function accept(
        Request $request,
        PrivacyConsentService $service
    ) {
        $dto = new PrivacyConcentData(
            userId: auth()->id(),
            version: config('privacy.version', '1.0'),
            ipAddress: $request->ip()
        );

        $service->accept($dto);

        return redirect()->back()->with(['success' => 'Privacy consent recorded.']);
    }
}
