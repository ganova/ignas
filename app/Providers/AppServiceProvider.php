<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Fail loudly on lazy-loaded relations in non-production so N+1
        // queries are caught during development instead of silently
        // degrading performance once real content volume grows.
        Model::preventLazyLoading(! $this->app->isProduction());
    }
}
