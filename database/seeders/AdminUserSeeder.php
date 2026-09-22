<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Reads credentials from the environment so nothing secret is committed.
     * ADMIN_EMAIL / ADMIN_PASSWORD in .env. If ADMIN_PASSWORD is not set,
     * a random password is generated and printed once to the console —
     * it is never stored in the repository or logs.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@ignas.studio');
        $password = env('ADMIN_PASSWORD');
        $generated = false;

        if (! $password) {
            $password = Str::password(16);
            $generated = true;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Ignas',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        if ($generated) {
            $this->command?->warn("Admin created: {$email} / {$password} — save this password now, it will not be shown again.");
        } else {
            $this->command?->info("Admin account ready: {$email}");
        }
    }
}
