<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonnelOvertimeUpdateRequest extends FormRequest
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
            'date_of_request' => 'required|date',
            'purpose_of_overtime' => 'required|string',
            'justification' => 'required|string',
            'attachment_file' => 'nullable|file|max:5120',
            'employee_id' => 'required|exists:personnel_employees,employee_id',
            'work_to_accomplished' => 'required|string',
            'duration_hours' => 'required|numeric|min:0.25',
            'date_of_overtime' => 'required|date|after_or_equal:date_of_request',
            'request_status' => 'nullable|boolean',
        ];
    }
}
