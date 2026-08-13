import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Edit({ user, employeeovertimes, closeModal }) {
    const currentUser = user?.user;
    const { data, setData, put, errors, reset } = useForm({
        date_of_request: employeeovertimes.date_of_request
            ? new Date(employeeovertimes.date_of_request)
                  .toISOString()
                  .slice(0, 10)
            : "",
        purpose_of_overtime: employeeovertimes.purpose_of_overtime || "",
        justification: employeeovertimes.justification || "",
        employee_id: currentUser?.employee_id ?? "",
        work_to_accomplished: employeeovertimes.work_to_accomplished || "",
        duration_hours: employeeovertimes.duration_hours || "",
        date_of_overtime: employeeovertimes.date_of_overtime
            ? new Date(employeeovertimes.date_of_overtime)
                  .toISOString()
                  .slice(0, 10)
            : "",
        request_status: employeeovertimes.request_status || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("employeeovertime.update", employeeovertimes.id), {
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
                Update Authority to Render Overtime
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
                            <span className="text-red-500">*</span>Date of
                            Request
                        </InputLabel>
                        <TextInput
                            name="date_of_request"
                            id="date_of_request"
                            type="date"
                            value={data.date_of_request || ""}
                            onChange={(e) =>
                                setData("date_of_request", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.date_of_request}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Purpose of
                            Overtime
                        </InputLabel>
                        <TextInput
                            name="purpose_of_overtime"
                            id="purpose_of_overtime"
                            type="text"
                            value={data.purpose_of_overtime || ""}
                            onChange={(e) =>
                                setData("purpose_of_overtime", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.purpose_of_overtime}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Justification
                        </InputLabel>
                        <TextInput
                            name="justification"
                            id="justification"
                            type="text"
                            value={data.justification || ""}
                            onChange={(e) =>
                                setData("justification", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.justification}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Work to
                            Accomplished
                        </InputLabel>
                        <TextInput
                            name="work_to_accomplished"
                            id="work_to_accomplished"
                            type="text"
                            value={data.work_to_accomplished || ""}
                            onChange={(e) =>
                                setData("work_to_accomplished", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.work_to_accomplished}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Duration # of
                            Hours
                        </InputLabel>
                        <TextInput
                            type="number"
                            step="0.25" // 15-minute increments
                            min="0"
                            placeholder="e.g. 1.5"
                            value={data.duration_hours}
                            onChange={(e) =>
                                setData("duration_hours", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.duration_hours}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date of
                            Overtime
                        </InputLabel>
                        <TextInput
                            name="date_of_overtime"
                            id="date_of_overtime"
                            type="date"
                            value={data.date_of_overtime || ""}
                            onChange={(e) =>
                                setData("date_of_overtime", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.date_of_overtime}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Request Status Checkbox */}
                <div className="flex items-center space-x-2 mt-2">
                    <input
                        type="checkbox"
                        name="request_status"
                        checked={data.request_status} // ✅ use checked instead of value
                        onChange={(e) =>
                            setData("request_status", e.target.checked)
                        } // ✅ returns true/false
                        className="w-4 h-4"
                    />
                    <label className="font-medium text-gray-700">
                        Request Status
                    </label>
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
