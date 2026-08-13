<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemoStoreRequest extends FormRequest
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
            'date_from'   => 'required|date',
            'date_to'  => 'nullable|date|after_or_equal:date_from',
            'title'    => ['required', 'string', 'max:50'],
            'status'    => ['required', 'string', 'max:50'],
            'provinces'   => ['required', 'array'],
            'provinces.*' => ['required', 'string', 'max:10'],
            'memo_number' => ['required', 'unique:memos,memo_number'],
        ];
    }
}
