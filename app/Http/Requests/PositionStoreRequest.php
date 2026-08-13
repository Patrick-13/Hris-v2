<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PositionStoreRequest extends FormRequest
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
            'post_name' => ['required', 'string', 'max:255'],
            'post_code' => 'required|string|unique:positions,post_code',
            'sec_id' => ['required', 'exists:sections,id'],
        ];
    }
}
