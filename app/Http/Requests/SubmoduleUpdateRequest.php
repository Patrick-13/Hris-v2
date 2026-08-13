<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmoduleUpdateRequest extends FormRequest
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
            'submoduleName' => ['required', 'string', 'max:255'],
            'module_id' => ['required', 'exists:modules,id']
        ];
    }
}
