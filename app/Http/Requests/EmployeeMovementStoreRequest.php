<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeMovementStoreRequest extends FormRequest
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
            'company_id' => ['required', 'exists:companies,id'],
            'employee_id' => [
                'required',
                'exists:personnel_employees,employee_id',
                'unique:employee_movements,employee_id',
            ],
            'division_id' => ['required', 'exists:divisions,id'],
            'section_id' => ['required', 'exists:sections,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'designation'    => ['string', 'max:50'],
            'employmentStatus'   => ['string', 'max:50'],
        ];
    }
}
