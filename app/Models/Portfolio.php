<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
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

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('published_at');
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
