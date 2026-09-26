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
