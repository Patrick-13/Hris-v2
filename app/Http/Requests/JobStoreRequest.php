<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobStoreRequest extends FormRequest
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
            'designation'    => ['required', 'string', 'max:50'],
            'jobTitle'    => ['required', 'string', 'max:50'],
            'employmentStatus'   => ['required', 'string', 'max:50'],
            'jobCategory'  => ['nullable', 'string', 'max:50'],
            'subUnit' => ['required', 'string', 'max:50'],
            'contractAttachement' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'],
            'startDate' => 'required|date',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ];
    }
}
