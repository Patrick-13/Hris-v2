<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DtrStoreRequest extends FormRequest
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
            'employee_id' => 'required|string',
            'punch_date'  => 'required|date',
            'timeIn' => ['nullable', 'date_format:H:i', 'before:12:00'],
            'breakOut' => ['nullable', 'date_format:H:i', 'after:timeIn'],
            'breakIn'     => 'nullable|date_format:H:i',
            'timeOut'  => ['nullable', 'date_format:H:i', 'after:breakIn'],
            'flexi_type' => ['nullable', 'string', 'in:FWB,FWA'],
        ];
    }

    public function messages()
    {
        return [
            'timeIn.before' => 'Time In must not be later than 11:59 AM.',
        ];
    }
}
