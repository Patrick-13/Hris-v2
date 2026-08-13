<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Mail\SendOtpMail;
use App\Models\Userloginlog;
use App\Services\ZkBioTimeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): RedirectResponse
    // {
    //     $request->authenticate();
    //     $request->session()->regenerate();

    //     $user = auth()->user();

    //     $deviceToken = hash('sha256', $request->userAgent() . $request->ip());

    //     $trustedDevice = $user->devices()
    //         ->where('device_token', $deviceToken)
    //         ->where('trusted_until', '>', now())
    //         ->first();

    //     // Trusted device → skip OTP
    //     if ($trustedDevice) {

    //         Userloginlog::create([
    //             'user_id'    => $user->id,
    //             'user_email' => $user->email,
    //             'user_ip'    => $request->ip(),
    //             'action'     => 'Login (Trusted Device)',
    //         ]);

    //         return $this->redirectByRole($user);
    //     }

    //     // New device → require OTP
    //     Userloginlog::create([
    //         'user_id'    => $user->id,
    //         'user_email' => $user->email,
    //         'user_ip'    => $request->ip(),
    //         'action'     => 'Login (OTP Required)',
    //     ]);

    //     $otp = rand(100000, 999999);

    //     $user->email_otp = Hash::make($otp);
    //     $user->otp_expires_at = now()->addMinutes(10); // OTP expires in 10 minutes
    //     $user->save();

    //     Mail::to($user->email)->send(new SendOtpMail($otp));

    //     session([
    //         'otp_user_id' => $user->id,
    //         'device_hash' => $deviceToken,
    //     ]);

    //     return redirect()->route('otp.page');
    // }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        $request->session()->regenerate();

        Userloginlog::create([
            'user_id'    => $user->id,
            'user_email' => $user->email,
            'user_ip'    => $request->ip(),
            'action'     => 'Login (OTP Required)',
        ]);


        return $this->redirectByRole($user);
    }

    private function redirectByRole($user)
    {
        if ($user->role === 'admin') {
            app(ZkBioTimeService::class)->getToken();
            return redirect()->route('admindashboard');
        }

        if ($user->role === 'user') {
            return redirect()->route('userdashboard');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $userIp = $request->ip();
        $actions = 'Logout';

        // Log the user logout event
        if ($user) {
            Userloginlog::create([
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_ip' => $userIp,
                'action' => $actions,
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
