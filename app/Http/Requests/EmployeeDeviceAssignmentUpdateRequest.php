<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeDeviceAssignmentUpdateRequest extends FormRequest
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
            'employee_id' => 'required|exists:personnel_employees,employee_id',
            'device_id' => 'required|exists:devices,id',
            'device_careOf' => 'nullable|exists:personnel_employees,employee_id',
            'assigned_at' => 'nullable|date',
            'returned_at' => 'nullable|date|after_or_equal:assigned_at',
            'remarks' => 'nullable|string|max:500',
        ];
    }
}
