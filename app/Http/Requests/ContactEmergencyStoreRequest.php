<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactEmergencyStoreRequest extends FormRequest
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
            'fullName'       => ['nullable', 'string'],
            'relationship'           => ['nullable', 'string'],
            'phoneNumber'          => ['nullable', 'string'],
            'workPhoneNumber'              => ['nullable', 'string'],
            'mobileNumber'          => ['nullable', 'string'],
            'status'          => ['nullable', 'string'],

        ];
    }
}
