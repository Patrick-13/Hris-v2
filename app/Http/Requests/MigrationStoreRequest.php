<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MigrationStoreRequest extends FormRequest
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
            'documentAttachement' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'],
            'number'    => ['required', 'string', 'max:50'],
            'issuedBy'    => ['required', 'string', 'max:50'],
            'issuedDate'   => 'required|date',
            'expiryDate'  => 'nullable|date|after_or_equal:issuedDate',
        ];
    }
}
