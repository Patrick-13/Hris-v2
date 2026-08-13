<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\LeaveCredit;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use Carbon\Carbon;

class PersonnelLeaveUpdateRequest extends FormRequest
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
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'leave_mode' => 'nullable|in:whole,half',
            'total_days' => 'nullable|numeric',
            // 'activity_id' => ['nullable', 'exists:activities,id'],
            'reason' => 'nullable|string',
            'leavespent' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'request_status' => 'nullable|boolean',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->validated();

            $employeeId = $data['employee_id'];
            $startDate = Carbon::parse($data['start_date']);
            $endDate = Carbon::parse($data['end_date']);
            $daysRequested = $data['total_days'];
            $daysRequest = $data['total_days'];
            $today      = Carbon::today();
            $year       = $today->year;

            if ($data['leave_mode'] === 'half') {
                $daysRequested  *= 0.625;
            } else {
                $daysRequested  *= 1.250;
            }

            // ********************************* //
            // ******** Check Leave Credits **** //
            // ********************************* //
            $leaveCredit = LeaveCredit::where('employee_id', $data['employee_id'])
                ->where('leave_type_id', $data['leave_type_id'])
                ->first();


            if (!$leaveCredit) {
                $validator->errors()->add(
                    'leave_type_id',
                    'No leave credits found for this leave type.'
                );
            } else {
                $balance = (float) ($leaveCredit->balance ?? 0);
                if ($balance < $daysRequested) {
                    $validator->errors()->add(
                        'end_date',
                        "Insufficient {$leaveCredit->leaveTypeBy->name} for the requested days. Your Current Balance is" . ' ' . $leaveCredit->balance
                    );
                }
            }

            $existingLeave = PersonnelLeave::where('employee_id', $employeeId)
                ->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q2) use ($startDate, $endDate) {
                            $q2->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                })
                ->whereHas('approvals', function ($q) {
                    $q->whereIn('status', ['pending', 'waiting', 'approved', 'auto-approved']);
                })
                ->first();

            if ($existingLeave) {
                $validator->errors()->add(
                    'start_date',
                    "You already applied for {$existingLeave->leaveType->name} on the selected date."
                );
            }
            // ********************************* //
            // ******** Vacation leave  ******** //
            // ********************************* //
            $vacationLeave = LeaveCredit::where('employee_id', $employeeId)
                ->where('leave_type_id', 1)
                ->where('year', $year)
                ->first();

            $vlRemaining = $vacationLeave?->balance ?? 0;

            if ($data['leave_type_id'] == 1) {

                // Lead time rule (5 days before application)
                if ($today->diffInDays($startDate) < 5) {
                    $validator->errors()->add(
                        'start_date',
                        'Vacation Leave must be applied at least 5 days before the start date.'
                    );
                }

                // Balance rule (must have more than 5)
                if ($vlRemaining <= 5) {
                    $validator->errors()->add(
                        'leave_type_id',
                        'You cannot apply for Vacation Leave because your remaining balance is 5 days or less.'
                    );
                }
            }

            // ********************************* //
            // ******** Sick Leave  ************ //
            // ********************************* //
            if ($data['leave_type_id'] == 2) {
                if ($startDate->gt($today) || $endDate->gt($today)) {
                    $validator->errors()->add(
                        'start_date',
                        'Sick Leave cannot be applied for future dates.'
                    );
                }
            }


            // ********************************* //
            // ******** Mandatory Force Leave  ************ //
            // ********************************* //
            if ($data['leave_type_id'] == 3) {

                if ($vlRemaining <= 5) {
                    $validator->errors()->add(
                        'leave_type_id',
                        'Mandatory Force Leave cannot be applied because your Vacation Leave balance is 5 days or less.'
                    );
                }
            }

            // ********************************* //
            // **** Special Privelage Leave  *** //
            // ********************************* //
            if ($data['leave_type_id'] == 6) {
                // Lead time rule (5 days before application)
                if ($today->diffInDays($startDate) < 5) {
                    $validator->errors()->add(
                        'start_date',
                        'Special Previlage Leave must be applied at least 5 days before the start date.'
                    );
                }
            }

            // ********************************* //
            // ****** Solo Parent Leave  ******* //
            // ********************************* //
            if ($data['leave_type_id'] == 7) {
                // Lead time rule (5 days before application)
                if ($today->diffInDays($startDate) < 5) {
                    $validator->errors()->add(
                        'start_date',
                        'Solo Parent Leave must be applied at least 5 days before the start date.'
                    );
                }
            }

            // ********************************* //
            // ******** Wellness Leave  ******** //
            // ********************************* //
            if ($data['leave_type_id'] == 9) {

                $employee = PersonnelEmployee::where(
                    'employee_id',
                    auth()->user()->employee_id
                )->first();

                if (
                    $employee &&
                    $employee->employment_status === 'Contractual'
                ) {

                    // Determine semester
                    if ($startDate->month <= 6) {
                        $semesterStart = Carbon::create($startDate->year, 1, 1);
                        $semesterEnd   = Carbon::create($startDate->year, 6, 30);
                    } else {
                        $semesterStart = Carbon::create($startDate->year, 7, 1);
                        $semesterEnd   = Carbon::create($startDate->year, 12, 31);
                    }

                    // Max 2 consecutive days
                    if ($daysRequested >= 2) {
                        $validator->errors()->add(
                            'end_date',
                            'Contractual employees may only avail up to 2 consecutive Wellness Leave days.'
                        );
                    }

                    // Already approved wellness leave in same semester
                    $usedDays = PersonnelLeave::where('employee_id', $employee->employee_id)
                        ->where('leave_type_id', 9)
                        ->whereBetween('start_date', [$semesterStart, $semesterEnd])
                        ->whereHas('approvals', function ($q) {
                            $q->whereIn('status', ['approved', 'auto-approved']);
                        })
                        ->get()
                        ->sum(function ($leave) {
                            return Carbon::parse($leave->start_date)
                                ->diffInDays($leave->end_date) + 1;
                        });

                    $totalAllowed = 2;

                    $remaining = $totalAllowed - $usedDays;

                    if ($remaining <= 0) {
                        $validator->errors()->add(
                            'leave_type_id',
                            'You have already consumed your Wellness Leave for this semester.'
                        );
                    }
                }
            }
        });
    }
}
