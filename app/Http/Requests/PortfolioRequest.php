<?php

namespace App\Http\Requests;

use App\Models\Portfolio;
use App\Models\SiteSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        $portfolio = $this->route('portfolio');

        return $this->user()?->can($portfolio ? 'update' : 'create', $portfolio ?? Portfolio::class) ?? false;
    }

    public function rules(): array
    {
        $portfolio = $this->route('portfolio');

        return [
            'title' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable', 'string', 'max:140', 'alpha_dash',
                Rule::unique('portfolios', 'slug')->ignore($portfolio?->id),
            ],
            'platform' => ['required', Rule::in(array_keys(Portfolio::PLATFORMS))],
            'category' => [
                'nullable', 'string', 'max:80',
                Rule::in($this->categories($portfolio?->category)),
            ],
            'duration' => ['nullable', 'string', 'max:20'],
            'views_label' => ['nullable', 'string', 'max:40'],
            'description' => ['nullable', 'string', 'max:2000'],
            'thumbnail_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'remove_thumbnail' => ['boolean'],
            'poster' => ['nullable', 'string', 'max:255'],
            'video_source' => ['required', Rule::in(['link', 'upload'])],
            'video_url' => ['nullable', 'url', 'max:255', 'required_if:video_source,link'],
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:153600', 'required_if:video_source,upload'],
            'external_url' => ['nullable', 'url', 'max:255'],
            'gradient_from' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'gradient_to' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:160'],
        ];
    }

    /** @return array<int, string> */
    private function categories(?string $current): array
    {
        $configured = SiteSetting::group('portfolio')['categories'] ?? [];
        $existing = Portfolio::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->all();
        $categories = collect([...$configured, ...$existing])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique(fn ($name) => mb_strtolower($name))
            ->values()
            ->all();

        if ($current && ! in_array($current, $categories, true)) {
            $categories[] = $current;
        }

        return array_values($categories);
    }
}
