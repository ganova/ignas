<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Portfolio extends Model
{
    use HasFactory, SoftDeletes;

    public const PLATFORMS = [
        'tiktok' => 'TikTok',
        'instagram' => 'Instagram Reels',
        'youtube' => 'YouTube',
        'commercial' => 'Commercial',
        'other' => 'Lainnya',
    ];

    /** Vertical (9:16) platforms, shown as "Short-Form"; everything else is "Long-Form". */
    public const SHORT_FORM_PLATFORMS = ['tiktok', 'instagram'];

    protected $fillable = [
        'title', 'slug', 'platform', 'category', 'duration', 'views_label',
        'description', 'thumbnail', 'poster', 'video_url', 'video_source', 'video_path', 'external_url',
        'gradient_from', 'gradient_to', 'is_featured', 'is_published',
        'published_at', 'sort_order', 'seo_title', 'seo_description',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeShortForm(Builder $query): Builder
    {
        return $query->whereIn('platform', self::SHORT_FORM_PLATFORMS);
    }

    public function scopeLongForm(Builder $query): Builder
    {
        return $query->whereNotIn('platform', self::SHORT_FORM_PLATFORMS);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('published_at');
    }

    /**
     * Cover image shown on cards: an uploaded thumbnail first, otherwise one
     * derived from the video link (YouTube / Google Drive), otherwise null so
     * the card falls back to the frame of an uploaded video or its gradient.
     */
    public function resolveThumbnailUrl(): ?string
    {
        if ($this->thumbnail) {
            return Str::startsWith($this->thumbnail, ['http://', 'https://', '/'])
                ? $this->thumbnail
                : Storage::disk('public')->url($this->thumbnail);
        }

        return $this->video_source === 'link' ? self::thumbnailFromVideoUrl($this->video_url) : null;
    }

    public static function thumbnailFromVideoUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        // Only works while the Drive file is shared as "Anyone with the link"; the card falls back otherwise.
        if (preg_match('~drive\.google\.com/(?:file/d/|open\?id=)([\w-]+)~', $url, $m)) {
            return "https://drive.google.com/thumbnail?id={$m[1]}&sz=w1000";
        }

        if (preg_match('~(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([\w-]{11})~', $url, $m)) {
            return "https://i.ytimg.com/vi/{$m[1]}/hqdefault.jpg";
        }

        return null;
    }

    /** Swap stored paths for the URLs the public pages render. */
    public function presentForPublic(): self
    {
        if ($this->video_source === 'upload' && $this->video_path) {
            $this->video_url = Storage::disk('public')->url($this->video_path);
        }
        $this->thumbnail = $this->resolveThumbnailUrl();

        return $this;
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            static::where('slug', $slug)
                ->when($ignoreId, fn (Builder $q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
