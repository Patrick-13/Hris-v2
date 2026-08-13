<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SectionStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sec_name' => ['required', 'string', 'max:255'],
            'sec_code' => ['required', 'string'],
            'div_id' => ['required', 'exists:divisions,id'],
            'sec_immediate_supervisor' => ['nullable', 'string', 'max:255'], // adjust max length as needed
        ];
    }
}
