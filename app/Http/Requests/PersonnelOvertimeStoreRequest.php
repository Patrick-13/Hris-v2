<?php

namespace App\Http\Requests;

use App\Models\Coc_credit;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class PersonnelOvertimeStoreRequest extends FormRequest
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
            'date_of_request' => 'required|date',
            'purpose_of_overtime' => 'required|string|max:255',
            'justification' => 'required|string|max:255',
            'attachment_file' => 'nullable|file|max:5120',
            'employee_id' => 'required|exists:personnel_employees,employee_id',
            'request_status' => 'nullable|boolean',
            'worktoaccomplishments' => 'required|array|min:1',
            'worktoaccomplishments.*.work_to_accomplished' => 'required|string|max:255',
            'worktoaccomplishments.*.duration_hours' => 'required|numeric|min:0.25',
            'worktoaccomplishments.*.date_of_overtime' => 'required|date|after_or_equal:date_of_request',
        ];
    }
    // public function withValidator($validator)
    // {
    //     $validator->after(function ($validator) {
    //         $data = $this->validated();

    //         $startDate = Carbon::parse($data['date_of_request']);
    //         $endDate = Carbon::parse($data['date_of_overtime']);
    //         $daysRequested = $startDate->diffInDays($endDate) + 1;


    //         // 2️⃣ Check overtime credits
    //         $overtimeCredit = Coc_credit::where('employee_id', $data['employee_id'])->first();

    //         if (!$overtimeCredit) {
    //             $balance = (float) ($overtimeCredit->balance ?? 0);
    //             if ($balance < $daysRequested) {
    //                 $validator->errors()->add(
    //                     'duration_hours',
    //                     'Insufficient overtime credits for the requested days. Your Current Balance is' . ' ' . $overtimeCredit?->balance
    //                 );
    //             }
    //         }
    //     });
    // }
}
