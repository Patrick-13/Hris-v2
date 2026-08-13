<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingStoreRequest extends FormRequest
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
            'soNumber' => 'nullable|string|unique:personnel_trainings,soNumber',
            'title' => 'required|string|max:255',
            'dateFrom' => 'required|date',
            'dateTo' => 'required|date|after_or_equal:dateFrom',
            'noofHours' => 'nullable|string|max:255',
            'type' => 'required|in:internal,external',
            'venue' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'employees' => 'required|array|min:1',
            'employees.*' => 'required|string|exists:personnel_employees,employee_id',
        ];
    }
}
