<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveCreditUpdateRequest extends FormRequest
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
            'employee_id' => ['required', 'exists:personnel_employees,employee_id'],
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'year' => ['required', 'digits:4', 'integer'],
            'entitled' => ['required', 'decimal:0,3', 'min:0'],
            'used' => ['nullable', 'decimal:0,3', 'min:0'],
            'balance' => ['required', 'decimal:0,3', 'min:0'],
        ];
    }
}
