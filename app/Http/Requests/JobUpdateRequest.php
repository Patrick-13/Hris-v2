<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobUpdateRequest extends FormRequest
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
            'employee_id' => ['exists:personnel_employees,employee_id'],
            'designation'    => ['string', 'max:50'],
            'jobTitle'    => ['string', 'max:50'],
            'employmentStatus'   => ['string', 'max:50'],
            'jobCategory'  => ['nullable', 'string', 'max:50'],
            'subUnit' => ['string', 'max:50'],
            'contractAttachement' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'],
            'startDate' => 'date',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ];
    }
}
