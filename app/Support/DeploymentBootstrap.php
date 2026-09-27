<?php

namespace App\Support;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeploymentBootstrap
{
    public static function run(): void
    {
        $marker = base_path('.deploy-ready');
        if (! app()->environment('production') || ! is_file($marker)) {
            return;
        }

        $lock = fopen(storage_path('framework/deploy-bootstrap.lock'), 'c');
        if ($lock === false || ! flock($lock, LOCK_EX | LOCK_NB)) {
            if (is_resource($lock)) {
                fclose($lock);
            }

            return;
        }

        try {
            clearstatcache(true, $marker);
            if (! is_file($marker)) {
                return;
            }

            Artisan::call('migrate', ['--force' => true]);
            CacheInvalidator::publicContent();
            unlink($marker);
        } catch (Throwable $exception) {
            Log::error('Automatic deployment migration failed.', [
                'exception' => $exception,
            ]);
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }
}
