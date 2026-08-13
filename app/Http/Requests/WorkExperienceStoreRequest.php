<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkExperienceStoreRequest extends FormRequest
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
            'dateFrom' => 'required|date',
            'dateTo' => 'required|date|after_or_equal:dateFrom',
            'jobTitle' => 'required|string',
            'emp_status' => ['required', 'in:regular,trainee,contractual,job order,permanent, summer job'],
            'isGovernment' => 'nullable|boolean',
            'department' => 'required|string',
            'agency' => 'required|string',
            'office' => 'required|string',
            'company' => 'required|string',
            'branch' => 'required|string',
            'leave_absent' => 'required|string',
            'monthysalary' => 'required|string',
            'paycolumngrade' => 'required|string',
            'separationCause' => 'required|string',
            'isActive' => 'nullable|boolean',
        ];
    }
}
