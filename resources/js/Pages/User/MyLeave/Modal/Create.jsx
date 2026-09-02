import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useEffect, useState } from "react";
import leaveSpentOptions from "@/Utils/leaveSpentOptions";
import dayjs from "dayjs";

export default function Create({
    leavetypes,
    ctoLeave,
    user,
    closeModal,
    employmentStatus,
}) {
    const currentUser = user?.user;
    const [dayCount, setDayCount] = useState(0);
    const [dayMode, setDayMode] = useState("whole"); // whole | half
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: currentUser?.employee_id ?? "",
        leave_type_id: "",
        leavespent: "",
        wellness_type: "",
        attachment_file: null,
        reason: "",
        start_date: "",
        end_date: "",
        request_status: "",
        total_days: 0,
        leave_mode: "",
    });

    const isCTO = [10].includes(parseInt(data.leave_type_id));
    const isWLP = [9].includes(parseInt(data.leave_type_id));

    const getWorkingDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        let count = 0;
        let current = dayjs(startDate);
        const end = dayjs(endDate);

        while (current.isSame(end) || current.isBefore(end)) {
            const day = current.day(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat

            // Monday-Thursday only
            if (day >= 1 && day <= 4) {
                count++;
            }

            current = current.add(1, "day");
        }

        return count;
    };

    const diffDays = getWorkingDays(data.start_date, data.end_date);

    const isSingleDay = diffDays === 1;

    const filteredLeaveTypes =
        employmentStatus === "Contractual"
            ? leavetypes.filter((leave) => [9, 10].includes(leave.id))
            : leavetypes.filter((leave) => [1, 2, 6, 9, 10].includes(leave.id));

    // const filteredLeaveTypes = leavetypes.filter((leave) => leave.id === 10);

    useEffect(() => {
        if (!data.start_date || !data.end_date) {
            setDayCount(0);
            setData("total_days", 0);
            return;
        }

        // Count only Monday-Thursday
        const workingDays = getWorkingDays(data.start_date, data.end_date);

        // Multi-day leave
        if (workingDays > 1) {
            setDayCount(workingDays);
            setData("total_days", workingDays);
            setData("leave_mode", null);
            return;
        }

        // Single-day CTO
        if (isCTO && workingDays === 1) {
            const value = dayMode === "half" ? 0.5 : 1;

            setDayCount(value);
            setData("total_days", value);
            setData("leave_mode", dayMode);

            return;
        }

        // Single-day regular leave
        setDayCount(workingDays);
        setData("total_days", workingDays);
    }, [data.start_date, data.end_date, data.leave_type_id, dayMode]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (processing) return;
        post(route("myleave.store"), {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Create Leave
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employee Id
                        </InputLabel>
                        <TextInput
                            name="employee_id"
                            id="employee_id"
                            type="text"
                            disabled
                            value={data.employee_id}
                            onChange={(e) =>
                                setData("employee_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 bg-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.employee_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Leave Type
                        </InputLabel>
                        <SelectInput
                            name="leave_type_id"
                            id="leave_type_id"
                            type="text"
                            value={data.leave_type_id || ""}
                            onChange={(e) =>
                                setData("leave_type_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Leave Type</option>
                            {filteredLeaveTypes?.map((leavetype) => (
                                <option key={leavetype.id} value={leavetype.id}>
                                    {leavetype.name}
                                </option>
                            ))}
                        </SelectInput>

                        {isWLP && (
                            <div className="mt-3 space-y-2">
                                <InputLabel>Wellness Type</InputLabel>

                                <SelectInput
                                    name="wellness_type"
                                    id="wellness_type"
                                    value={data.wellness_type || ""}
                                    onChange={(e) =>
                                        setData("wellness_type", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Select Type</option>
                                    <option value="normal">Normal</option>
                                    <option value="emergency">Emergency</option>
                                </SelectInput>

                                <InputError
                                    message={errors.wellness_type}
                                    className="mt-2"
                                />
                            </div>
                        )}
                        {isCTO && (
                            <div className="mt-3 space-y-2">
                                <InputLabel>Select CTO</InputLabel>

                                <SelectInput
                                    name="leave_type_id"
                                    id="leave_type_id"
                                    value={data.leave_type_id || ""}
                                    onChange={(e) =>
                                        setData("leave_type_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    {ctoLeave?.map((ctoLeave_) => (
                                        <option
                                            key={ctoLeave_.id}
                                            value={ctoLeave_.id}
                                        >
                                            {ctoLeave_.entitled}
                                        </option>
                                    ))}
                                </SelectInput>

                                <InputError
                                    message={errors.leave_type_id}
                                    className="mt-2"
                                />
                            </div>
                        )}
                        {data.wellness_type === "emergency" &&
                            data.total_days >= 3 && (
                                <div className="mt-3 space-y-2">
                                    <InputLabel>
                                        Attach File{" "}
                                        <span className="text-red-500">*</span>
                                    </InputLabel>

                                    <TextInput
                                        name="attachment_file"
                                        id="attachment_file"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                                        onChange={(e) =>
                                            setData(
                                                "attachment_file",
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    <InputError
                                        message={errors.attachment_file}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        <InputError
                            message={errors.leave_type_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Leave Spent
                        </InputLabel>
                        <SelectInput
                            name="leavespent"
                            id="leavespent"
                            type="text"
                            value={data.leavespent || ""}
                            onChange={(e) =>
                                setData("leavespent", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Leave Spent</option>
                            {leaveSpentOptions &&
                                leaveSpentOptions.map((leaveSpentOption) => (
                                    <option
                                        key={leaveSpentOption.value}
                                        value={leaveSpentOption.value}
                                    >
                                        {leaveSpentOption.label}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.leavespent}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            {data.wellness_type === "emergency" && (
                                <span className="text-red-500">*</span>
                            )}
                            Reason
                        </InputLabel>
                        <TextInput
                            name="reason"
                            id="reason"
                            type="text"
                            value={data.reason || ""}
                            onChange={(e) => setData("reason", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.reason} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Start Date
                        </InputLabel>
                        <TextInput
                            name="start_date"
                            id="start_date"
                            type="date"
                            value={data.start_date || ""}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.start_date}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>End Date
                        </InputLabel>
                        <TextInput
                            name="end_date"
                            id="end_date"
                            type="date"
                            value={data.end_date || ""}
                            onChange={(e) =>
                                setData("end_date", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.end_date}
                            className="mt-2"
                        />
                    </div>
                    {isCTO && isSingleDay && (
                        <div className="mt-3 space-y-2">
                            <InputLabel>Leave Mode</InputLabel>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 dark:text-gray-900">
                                    <input
                                        type="radio"
                                        checked={dayMode === "whole"}
                                        onChange={() => setDayMode("whole")}
                                    />
                                    Whole Day (1.0)
                                </label>

                                <label className="flex items-center gap-2 dark:text-gray-900">
                                    <input
                                        type="radio"
                                        checked={dayMode === "half"}
                                        onChange={() => setDayMode("half")}
                                    />
                                    Half Day (0.5)
                                </label>
                            </div>
                        </div>
                    )}

                    {dayCount > 0 && (
                        <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            Total Days: {dayCount}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                >
                    Cancel
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`px-4 py-2 rounded shadow text-white transition ${
                        processing
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {processing ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
}
