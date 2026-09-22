<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/auth/login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // Regenerate the session id after login to prevent session fixation.
        $request->session()->regenerate();

        return redirect()->intended('/admin');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }

    /**
     * Logs out every other session for this user (all devices except the
     * current one), using Laravel's built-in "log out other devices" flow.
     */
    public function destroyOtherSessions(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        Auth::logoutOtherDevices($request->string('password'));

        return back()->with('success', 'Sesi di perangkat lain telah diakhiri.');
    }
}
