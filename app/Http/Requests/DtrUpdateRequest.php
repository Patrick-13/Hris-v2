<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DtrUpdateRequest extends FormRequest
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
            'timeIn'   => ['nullable', 'date_format:H:i'],
            'breakOut' => ['nullable', 'date_format:H:i', 'after:timeIn'],
            'breakIn'  => ['nullable', 'date_format:H:i'],
            'timeOut'  => ['nullable', 'date_format:H:i', 'after:breakIn'],
        ];
    }
}
