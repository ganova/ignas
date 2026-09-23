<?php

use App\Support\CacheInvalidator;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * SiteSetting::CACHE_KEY is cached forever and merges DB rows over
     * SiteSetting::defaults(). The identity.bio_paragraph_1/2 defaults added
     * since the last cache flush (2026_09_22_121829) never appeared on any
     * environment that had already rendered the homepage, because the old
     * merged array — from before those fields existed — was still cached.
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
