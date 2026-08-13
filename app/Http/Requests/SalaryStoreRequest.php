<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalaryStoreRequest extends FormRequest
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
            'salarySchedule'    => ['required', 'string', 'max:50'],
            'payGrade'    => ['required', 'string', 'max:50'],
            'steps'   => ['required', 'string', 'max:50'],
            'amount'  => ['nullable', 'string', 'max:50'],
            'salaryComponent' => ['required', 'string', 'max:50'],
            'payFrequency' => ['required', 'string', 'max:50'],

        ];
    }
}
