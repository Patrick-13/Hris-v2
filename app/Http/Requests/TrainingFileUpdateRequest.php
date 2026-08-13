<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingFileUpdateRequest extends FormRequest
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
            'employee_id' => 'required|string|exists:personnel_employees,employee_id',
            'training_id' => 'required|integer|exists:personnel_trainings,id',
            'ilrFile' => 'required|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:20480', // max 20MB
        ];
    }
}
