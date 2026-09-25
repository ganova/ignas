<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo', 'website_url', 'is_published', 'sort_order'];

    protected $casts = ['is_published' => 'boolean'];

    protected $appends = ['logo_url'];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    protected function logoUrl(): Attribute
    {
        return Attribute::get(fn () => $this->logo ? Storage::disk('public')->url($this->logo) : null);
    }
}
