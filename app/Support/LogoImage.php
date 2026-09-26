<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Throwable;

/**
 * Prepares uploaded logos/icons for small display slots: exported logos often
 * sit in a large white or transparent canvas, which leaves the mark itself a
 * few pixels tall once scaled to fit. Trims that border and caps the size.
 */
class LogoImage
{
    /** Caps an uploaded image (e.g. a portfolio cover) so pages don't ship multi-MB photos. */
    public static function downscale(string $path, int $max, string $disk = 'public'): void
    {
        if (! extension_loaded('gd')) {
            return;
        }

        $fullPath = Storage::disk($disk)->path($path);

        try {
            (new ImageManager(new Driver))->decodePath($fullPath)->scaleDown(width: $max, height: $max)->save($fullPath);
        } catch (Throwable $e) {
            Log::warning('Image downscale skipped', ['path' => $path, 'error' => $e->getMessage()]);
        }
    }

    public static function tidy(string $path, string $disk = 'public'): void
    {
        if (! extension_loaded('gd')) {
            return;
        }

        $fullPath = Storage::disk($disk)->path($path);

        try {
            $image = (new ImageManager(new Driver))->decodePath($fullPath);
            $image->trim(12)->scaleDown(width: 800, height: 800)->save($fullPath);
        } catch (Throwable $e) {
            // A logo that can't be processed is still better shown untrimmed than rejected.
            Log::warning('Logo trim skipped', ['path' => $path, 'error' => $e->getMessage()]);
        }
    }
}
