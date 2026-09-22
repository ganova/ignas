<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    protected $fillable = ['disk', 'path', 'original_name', 'mime_type', 'size', 'width', 'height', 'alt_text'];

    protected $appends = ['url'];

    protected function url(): Attribute
    {
        return Attribute::get(fn () => Storage::disk($this->disk)->url($this->path));
    }

    /**
     * Check whether this media is referenced by any content, to avoid
     * deleting files still in use (portfolio thumbnails/posters and
     * site settings such as the showreel poster).
     */
    public function isInUse(): bool
    {
        $url = $this->url;

        $usedInPortfolio = Portfolio::query()
            ->where('thumbnail', $url)
            ->orWhere('poster', $url)
            ->exists();

        if ($usedInPortfolio) {
            return true;
        }

        $settingsJson = SiteSetting::query()->pluck('value')
            ->map(fn ($value) => json_encode($value))
            ->implode(' ');

        return str_contains($settingsJson, $url);
    }
}
