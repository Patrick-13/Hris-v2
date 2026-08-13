<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HolidayStoreRequest extends FormRequest
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
            'holiday_date'  => 'required|date',
            'name' => 'required|string|unique:holidays,name',
            'type' => ['nullable', 'string', 'in:Regular,Special_Non,Special_Work,Local'],
        ];
    }
}
