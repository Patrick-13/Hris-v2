<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EducationStoreRequest extends FormRequest
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
            'educationLevel'    => 'required|in:Elementary,Secondary,Vocational/Trade Couse,College,Graduate Studies',
            'schoolName'   => ['required', 'string', 'max:200'],
            'degree'  => ['nullable', 'string', 'max:150'],
            'yeargraduate' => ['required', 'string', 'max:50'],
            'highestlevel' => ['required', 'string', 'max:50'],
            'unitsEarned' => ['nullable', 'string', 'max:50'],
            'dateFrom' => 'required|date',
            'dateTo' => 'required|date|after_or_equal:dateFrom',
            'scholarship_honors' => ['nullable', 'string', 'max:50'],
            'isGraduated' => ['nullable', 'string', 'max:50'],
        ];
    }
}
