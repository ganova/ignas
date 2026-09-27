<?php

namespace App\Http\Requests;

use App\Models\Photo;
use Illuminate\Foundation\Http\FormRequest;

class PhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $photo = $this->route('photo');

        return $this->user()?->can($photo ? 'update' : 'create', $photo ?? Photo::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'photo_file' => [$this->route('photo') ? 'nullable' : 'required', 'image', 'mimes:png,jpg,jpeg,webp,avif', 'max:10240'],
            'remove_photo' => ['boolean'],
            'caption' => ['nullable', 'string', 'max:500'],
            'alt_text' => ['nullable', 'string', 'max:200'],
            'is_published' => ['boolean'],
        ];
    }
}
