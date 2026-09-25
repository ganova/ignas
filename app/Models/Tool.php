<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * A piece of software shown in the "Software expertise" block.
 */
class Tool extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'category', 'is_published', 'sort_order'];

    protected $casts = ['is_published' => 'boolean'];

    protected $appends = ['icon_url'];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    protected function iconUrl(): Attribute
    {
        return Attribute::get(fn () => $this->icon ? Storage::disk('public')->url($this->icon) : null);
    }
}
