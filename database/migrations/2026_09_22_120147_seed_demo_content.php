<?php

use Database\Seeders\FaqSeeder;
use Database\Seeders\PortfolioSeeder;
use Database\Seeders\ProcessStepSeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Deployment platforms here (Railway/Railpack) run `php artisan migrate
     * --force` automatically but do not run custom seeders or
     * docker/railway/start.sh, so demo content is bootstrapped here instead
     * — see 2026_09_22_090235_seed_initial_admin_user.php for the same
     * pattern applied to the admin user. Each seeder uses updateOrCreate(),
     * so re-running this migration (e.g. locally) is harmless.
     *
     * Skipped in `testing`: RefreshDatabase runs every migration against
     * ignas_testing before each test, and the feature tests assert on exact
     * row counts (e.g. "only one portfolio" after creating one via a
     * factory) — demo rows here would silently inflate those counts.
     */
    public function up(): void
    {
        if (app()->environment('testing')) {
            return;
        }

        (new PortfolioSeeder)->run();
        (new ServiceSeeder)->run();
        (new ProcessStepSeeder)->run();
        (new FaqSeeder)->run();
    }

    public function down(): void
    {
        //
    }
};
