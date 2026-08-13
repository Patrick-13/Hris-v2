<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeductionStoreRequest extends FormRequest
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
            'employee_id' => [
                'required',
                'exists:personnel_employees,employee_id',
                'unique:employee_deductions,employee_id',
            ],
            'sss'        => ['nullable', 'numeric', 'min:0'],
            'philhealth' => ['nullable', 'numeric', 'min:0'],
            'pagibig'    => ['nullable', 'numeric', 'min:0'],
            'tax'        => ['nullable', 'numeric', 'min:0'],
            'union_fee'  => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
