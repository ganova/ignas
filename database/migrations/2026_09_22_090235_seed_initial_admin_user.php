<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Deployment platforms here (Railway/Railpack) run `php artisan migrate
     * --force` automatically but do not run custom seeders, so the initial
     * admin account is created here instead — this is the only step of the
     * deploy pipeline guaranteed to execute without manual shell access.
     */
    public function up(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@ignas.studio');
        $password = env('ADMIN_PASSWORD');

        if (! $password) {
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Ignas',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );
    }

    public function down(): void
    {
        //
    }
};
