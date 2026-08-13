<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeviceUpdateRequest extends FormRequest
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
            'fundType' => 'required|string|max:255',
            'ppeType' => 'required|string|max:255',
            'parNo' => 'nullable|string|unique:devices,parNo',
            'category_id' => 'required|integer|exists:device_categories,id',
            'description' => 'required|string|max:255',
            'serial_number' => 'nullable|string|unique:devices,serial_number',
            'property_number' => 'required|unique:devices,property_number',
            'unitofMeasure' => 'nullable|string|max:255',
            'quantity_property_card' => 'required|numeric|min:1',
            'quantity_physical_count' => 'required|numeric|min:1',
            'brand' => 'nullable|string|max:255',
            'status' => 'in:available,partially assigned,maintenance,retired, unavailable',
            'price' => 'required|numeric|min:0',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'remarks' => 'nullable|string',
        ];
    }
}
