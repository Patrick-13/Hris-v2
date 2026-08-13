<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TkoUpdateRequest extends FormRequest
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
            'employee_id' => 'nullable|string|exists:personnel_employees,employee_id',
            'tko_type' => 'nullable|in:timeIn,breakIn,breakOut,timeOut',
            'date' => 'nullable|date',
            'tko_time' => 'nullable',
            'attachment_file' => 'nullable|file|max:5120',
            'remarks' => 'nullable|string',
        ];
    }
}
