<?php

namespace App\Http\Requests;

use App\Models\ProcessStep;
use Illuminate\Foundation\Http\FormRequest;

class ProcessStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        $processStep = $this->route('process_step');

        return $this->user()?->can($processStep ? 'update' : 'create', $processStep ?? ProcessStep::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'step_number' => ['required', 'integer', 'min:1'],
            'label' => ['required', 'string', 'max:40'],
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:500'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
