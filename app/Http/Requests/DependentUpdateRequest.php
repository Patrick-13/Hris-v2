<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DependentUpdateRequest extends FormRequest
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
            'lastName'    => ['required', 'string', 'max:50'],
            'firstName'   => ['required', 'string', 'max:50'],
            'middleName'  => ['required', 'string', 'max:50'],
            'relationship' => ['required', 'string', 'max:50'],
            'dateofBirth' => ['required', 'date', 'max:50'],
            'status' => ['required', 'boolean'],
        ];
    }
}
