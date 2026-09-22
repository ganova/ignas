<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Intentionally no registration routes: admin accounts are created only via
// the AdminUserSeeder / artisan seeding, never through a public form.
Route::middleware('guest')->group(function () {
    Route::get('admin/login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
    Route::post('admin/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('admin.login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('admin/logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');
    Route::post('admin/logout-other-devices', [AuthenticatedSessionController::class, 'destroyOtherSessions'])
        ->name('admin.logout-other-devices');
});
