<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class CacheInvalidator
{
    public const PUBLIC_HOME_KEY = 'public:home-payload';

    /**
     * Invalidate all cached data the public site reads. Called after any
     * admin write so changes appear immediately without a manual cache clear.
     */
    public static function publicContent(): void
    {
        Cache::forget(self::PUBLIC_HOME_KEY);
    }
}
