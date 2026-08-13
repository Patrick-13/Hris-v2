<?php

namespace App\Http\Requests;

use App\Models\Dtr;
use App\Models\Tko;
use Carbon\Carbon;

use Illuminate\Foundation\Http\FormRequest;

class TkoStoreRequest extends FormRequest
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
            'tko_type' => 'required|in:timeIn,breakIn,breakOut,timeOut',
            'date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {

                    $today = now();
                    $selectedDate = Carbon::parse($value);

                    // Current semester
                    if ($today->month <= 6) {
                        $semesterStart = $today->copy()->startOfYear();
                        $semesterEnd = $today->copy()->month(6)->endOfMonth();
                    } else {
                        $semesterStart = $today->copy()->month(7)->startOfMonth();
                        $semesterEnd = $today->copy()->endOfYear();
                    }

                    // Prevent applying for a previous semester
                    if (!$selectedDate->between($semesterStart, $semesterEnd)) {
                        $fail('You can only submit TKO requests for the current semester.');
                        return;
                    }

                    // Count HR-approved TKOs in the current semester
                    $approvedCount = Tko::where('employee_id', $this->employee_id)
                        ->whereBetween('date', [$semesterStart, $semesterEnd])
                        ->whereHas('approvals', function ($q) {
                            $q->where('level', 'hr')
                                ->where('status', 'approved');
                        })
                        ->count();

                    if ($approvedCount >= 3) {
                        $fail('You have already used all three (3) TKO requests for the current semester.');
                    }
                },
            ],

            'tko_time' => [
                'required',
                function ($attribute, $value, $fail) {

                    $dtr = Dtr::where('employee_id', $this->employee_id)
                        ->whereDate('punch_date', $this->date)
                        ->first();

                    if (! $dtr) {
                        $fail('No DTR record found for the selected date.');
                        return;
                    }

                    $newTime = Carbon::parse($value);

                    switch ($this->tko_type) {

                        case 'breakOut':
                            if ($dtr->timeIn && $newTime->lte(Carbon::parse($dtr->timeIn))) {
                                $fail('Break Out must be after Time In. Your Time In is ' . $dtr->timeIn);
                            }
                            break;

                        case 'breakIn':
                            if ($dtr->breakOut && $newTime->lte(Carbon::parse($dtr->breakOut))) {
                                $fail('Break In must be after Break Out. Your break Out is ' . $dtr->breakOut);
                            }
                            break;

                        case 'timeOut':
                            if ($dtr->breakIn && $newTime->lte(Carbon::parse($dtr->breakIn))) {
                                $fail('Time Out must be after Break In. Your break In is ' . $dtr->breakIn);
                            } elseif (!$dtr->breakIn && $dtr->timeIn && $newTime->lte(Carbon::parse($dtr->timeIn))) {
                                $fail('Time Out must be after Time In. Your Time In is ' . $dtr->timeIn);
                            }
                            break;
                    }
                },
            ],

            'attachment_file' => 'nullable|file|max:5120',
            'remarks' => 'nullable|string',
        ];
    }
}
