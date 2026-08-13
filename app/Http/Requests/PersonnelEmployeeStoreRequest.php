<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class PersonnelEmployeeStoreRequest extends FormRequest
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
            'employee_id' => 'required|string|unique:personnel_employees,employee_id',
            'lastname' => ['required', 'string', 'max:55'],
            'firstname' => ['required', 'string', 'max:55'],
            'middlename' => ['required', 'string', 'max:55'],
            'nickname' => ['required', 'string', 'max:55'],
            'email' => 'required|string|unique:personnel_employees,email',
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'in:male,female,other'],
            'civil_status' => ['required', 'in:single,married,divorced,widow'],
            'citizenship' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'numeric', 'max:255'],
            'height' => ['required', 'numeric', 'max:255'],
            'bloodtype' => ['required', 'string', 'max:255'],
            'gsis' => ['nullable', 'string', 'max:255'],
            'pagibig_number' => ['nullable', 'string', 'max:255'],
            'sss_number' => ['nullable', 'string', 'max:255'],
            'philhealth_number' => ['nullable', 'string', 'max:255'],
            'TIN' => ['nullable', 'string', 'max:255'],
            'date_hired' => ['required', 'date'],
            'emp_status' => ['required', 'boolean'],
            'employment_status' => ['required', 'string', 'max:255'],
            'flexi_type' => ['required', 'string', 'in:FWA-A,FWA-B'],
            'in_office' => ['required', 'boolean'],
            'office_id' => ['required', 'array'],
            'office_id.*' => ['exists:offices,id'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'account_no' => ['nullable', 'numeric', 'min:0'],
            'fundtype' => ['nullable', 'string', 'in:Regular Fund,Regular Fund Enmo,ERF,PMCC'],
            'charging' => ['nullable', 'string'],
            'province_office' => ['nullable', 'string']

        ];
    }
}
