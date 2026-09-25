<?php

namespace App\Http\Requests;

use App\Models\Tool;
use Illuminate\Foundation\Http\FormRequest;

class ToolRequest extends FormRequest
{
    public function authorize(): bool
    {
        $tool = $this->route('tool');

        return $this->user()?->can($tool ? 'update' : 'create', $tool ?? Tool::class) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:60'],
            'category' => ['nullable', 'string', 'max:40'],
            // SVG is excluded on purpose: it can carry script and is served from the site's own origin.
            'icon_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:1024'],
            'remove_icon' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }
}
