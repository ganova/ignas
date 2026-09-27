<?php

namespace App\Models;

use Database\Factories\PhotoFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    /** @use HasFactory<PhotoFactory> */
    use HasFactory;

    protected $fillable = ['title', 'image', 'alt_text', 'caption', 'is_published', 'sort_order'];

    protected $casts = ['is_published' => 'boolean'];

    protected $appends = ['image_url'];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (): string => Storage::disk('public')->url($this->image));
    }
}
