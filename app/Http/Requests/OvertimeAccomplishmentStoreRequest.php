<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OvertimeAccomplishmentStoreRequest extends FormRequest
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
            'accomplishments' => 'required|array|min:1',
            'accomplishments.*.work_accomplished' => 'required|string',
            'accomplishments.*.duration_hours' => 'required|numeric|min:0.25',
            'accomplishments.*.attachment' => 'nullable|file|mimes:pdf|max:20480',
        ];
    }
}
