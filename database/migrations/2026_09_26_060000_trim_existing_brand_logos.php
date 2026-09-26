<?php

use App\Models\Brand;
use App\Models\Tool;
use App\Support\CacheInvalidator;
use App\Support\LogoImage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Logos uploaded before LogoImage::tidy() existed still carry their big
     * blank margins. Re-process them under a new filename, since /storage
     * files are served with a long browser cache lifetime.
     */
    public function up(): void
    {
        $disk = Storage::disk('public');

        foreach ([[Brand::class, 'logo'], [Tool::class, 'icon']] as [$model, $column]) {
            $model::query()->whereNotNull($column)->get()->each(function ($row) use ($disk, $column) {
                $old = $row->{$column};
                if (! $disk->exists($old)) {
                    return;
                }

                $new = dirname($old).'/'.Str::random(40).'.'.pathinfo($old, PATHINFO_EXTENSION);
                $disk->copy($old, $new);
                LogoImage::tidy($new);

                $row->update([$column => $new]);
                $disk->delete($old);
            });
        }

        CacheInvalidator::publicContent();
    }

    public function down(): void
    {
        //
    }
};
