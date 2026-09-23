<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class CacheInvalidator
{
    public const PUBLIC_HOME_KEY = 'public:home-payload';

    /**
     * Invalidate all cached data the public site reads. Called after any
     * admin write so changes appear immediately without a manual cache clear.
     *
     * SiteSetting::CACHE_KEY is cached forever and merges DB rows over
     * SiteSetting::defaults(), which is PHP source, not DB content — so a
     * deploy that changes defaults() needs this forgotten too, or the old
     * merged snapshot keeps hiding the new/changed default fields
     * indefinitely (see the flush_public_home_cache migration for the same
     * bug that previously hit PUBLIC_HOME_KEY).
     */
    public static function publicContent(): void
    {
        Cache::forget(self::PUBLIC_HOME_KEY);
        Cache::forget(SiteSetting::CACHE_KEY);
    }
}
