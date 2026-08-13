<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class OtpController extends Controller
{
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required'
        ]);

        $user = User::find(session('otp_user_id'));

        if (!$user) {
            return back()->withErrors(['otp' => 'Session expired']);
        }

        if ($user->otp_expires_at < now()) {
            return back()->withErrors(['otp' => 'OTP expired']);
        }

        if (!Hash::check($request->otp, $user->email_otp)) {
            return back()->withErrors(['otp' => 'Invalid OTP']);
        }
        $deviceToken = session('device_hash');

        $user->devices()->updateOrCreate(
            ['device_token' => $deviceToken],
            [
                'ip_address' => request()->ip(),
                'user_agent' => $request->userAgent(),
                'trusted_until' => now()->addMonth(),
            ]
        );

        // clear OTP
        $user->email_otp = null;
        $user->otp_expires_at = null;
        $user->otp_verified_at = now();
        $user->save();

        // login user
        Auth::login($user);

        session()->forget(['otp_user_id', 'device_hash']);

        return $this->redirectByRole($user);
    }

    private function redirectByRole($user)
    {
        if ($user->role === 'admin') {
            return redirect()->route('admindashboard');
        }

        if ($user->role === 'user') {
            return redirect()->route('userdashboard');
        }
    }
}
