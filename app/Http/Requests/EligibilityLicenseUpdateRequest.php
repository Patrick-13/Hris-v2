<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EligibilityLicenseUpdateRequest extends FormRequest
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
            'cse'    => ['required', 'string', 'max:50'],
            'rating'    => ['required', 'string', 'max:50'],
            'placeExamTaken'   => ['required', 'string', 'max:50'],
            'dateTaken'  => 'required|date',
            'profLicenseNumber' => ['required', 'string', 'max:50'],
            'dateRelease' => 'nullable|date|after_or_equal:dateTaken',
        ];
    }
}
