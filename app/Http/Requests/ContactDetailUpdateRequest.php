<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactDetailUpdateRequest extends FormRequest
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
            'addressType'       => ['nullable', 'string'],
            'country'           => ['nullable', 'string'],
            'region'           => ['nullable', 'string'],
            'province'          => ['nullable', 'string'],
            'city'              => ['nullable', 'string'],
            'barangay'          => ['nullable', 'string'],
            'street'            => ['nullable', 'string'],
            'houseNumber'       => ['nullable', 'string'],
            'workemail'         => ['nullable', 'string'],
            'otheremail'        => ['nullable', 'string'],
            'workphoneNumber'   => ['nullable', 'string'],
            'homephoneNumber'   => ['nullable', 'string'],
            'mobileNumber'      => ['nullable', 'string'],
        ];
    }
}
