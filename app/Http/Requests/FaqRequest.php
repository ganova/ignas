<?php

namespace App\Http\Requests;

use App\Models\Faq;
use App\Support\TextSanitizer;
use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        $faq = $this->route('faq');

        return $this->user()?->can($faq ? 'update' : 'create', $faq ?? Faq::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:200'],
            'answer' => ['nullable', 'string', 'max:2000'],
            'is_open_by_default' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @param  string|array<int, string>|null  $key
     * @return array<string, mixed>|mixed
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();
        $validated['answer'] = TextSanitizer::sanitizeRichText($validated['answer'] ?? null);

        if ($key !== null) {
            return data_get($validated, $key, $default);
        }

        return $validated;
    }
}
