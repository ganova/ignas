<?php

use App\Support\CacheInvalidator;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * The homepage payload is cached for an hour (see HomeController), so
     * the seed_demo_content and SiteSetting default-copy changes above
     * would otherwise sit invisible behind a stale cache entry on any
     * environment where the page was already hit once before this deploy.
     */
    public function up(): void
    {
        CacheInvalidator::publicContent();
    }

    public function down(): void
    {
        //
    }
};
