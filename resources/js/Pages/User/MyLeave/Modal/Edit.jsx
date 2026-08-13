import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useEffect, useState } from "react";
import leaveSpentOptions from "@/Utils/leaveSpentOptions";
import dayjs from "dayjs";

export default function Edit({
    employeeleaves,
    // activitytypes,
    leavetypes,
    user,
    employmentStatus,
    closeModal,
}) {
    const currentUser = user?.user;
    const [dayCount, setDayCount] = useState(0);
    const [dayMode, setDayMode] = useState("whole");
    const { data, setData, put, errors, reset } = useForm({
        employee_id: employeeleaves.employee_id || "",
        leave_type_id: employeeleaves.leave_type_id || "",
        // activity_id: employeeleaves.activity_id || "",
        leavespent: employeeleaves.leavespent || "",
        reason: employeeleaves.reason || "",
        start_date: employeeleaves.start_date?.split("T")[0] ?? "",
        end_date: employeeleaves.end_date?.split("T")[0] ?? "",
        request_status: employeeleaves.request_status || "",
        total_days: employeeleaves.total_days || "",
    });

    const isCTO = [9, 10].includes(parseInt(data.leave_type_id));

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

    useEffect(() => {
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            setDayCount(diff);
        } else {
            setDayCount(0);
        }
    }, [data.start_date, data.end_date]);

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
        put(route("myleave.update", employeeleaves.id), {
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
                Edit Leave
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
                        <InputError
                            message={errors.leave_type_id}
                            className="mt-2"
                        />
                    </div>
                    {/* {leavetypes.find(
                        (lt) =>
                            lt.id === parseInt(data.leave_type_id) &&
                            lt.name
                                .toLowerCase()
                                .includes("compensatory time-off"),
                    ) && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>CTO
                                Activity to Apply
                            </InputLabel>
                            <SelectInput
                                name="activity_id"
                                id="activity_id"
                                value={data.activity_id || ""}
                                onChange={(e) =>
                                    setData("activity_id", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select CTO to Apply</option>
                                {activitytypes &&
                                    activitytypes.map((activitytype) => (
                                        <option
                                            key={activitytype.id}
                                            value={activitytype.id}
                                        >
                                            {activitytype.activity_type_by
                                                .name +
                                                " - S.0 #" +
                                                activitytype.soNumber}
                                        </option>
                                    ))}
                            </SelectInput>
                            <InputError
                                message={errors.activity_id}
                                className="mt-2"
                            />
                        </div>
                    )} */}

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
                            <span className="text-red-500">*</span>Reason
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
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
