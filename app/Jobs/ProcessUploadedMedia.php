<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProcessUploadedMedia implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Media $media) {}

    public function handle(): void
    {
        if (! str_starts_with($this->media->mime_type, 'image/')) {
            return;
        }

        $disk = Storage::disk($this->media->disk);
        $fullPath = $disk->path($this->media->path);

        $image = (new ImageManager(new Driver))->decodePath($fullPath);

        $this->media->update([
            'width' => $image->width(),
            'height' => $image->height(),
        ]);

        // Web-optimized WebP variant, capped at 1600px wide, alongside the
        // original. save() picks the encoder from the destination extension.
        $webpPath = preg_replace('/\.[a-zA-Z0-9]+$/', '.webp', $this->media->path);
        $image->scaleDown(width: 1600)->save($disk->path($webpPath), quality: 82);
    }
}
