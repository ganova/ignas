<?php

namespace App\Http\Requests;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;

class BrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        $brand = $this->route('brand');

        return $this->user()?->can($brand ? 'update' : 'create', $brand ?? Brand::class) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:80'],
            'website_url' => ['nullable', 'url', 'max:255'],
            // SVG is excluded on purpose: it can carry script and is served from the site's own origin.
            'logo_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'remove_logo' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }
}
