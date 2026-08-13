import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Edit({
    employeedevices,
    employees,
    devices,
    closeModal,
}) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: employeedevices.employee_id || "",
        device_id: employeedevices.device_id || "",
        device_careOf: employeedevices.device_careOf || "",
        assigned_at: employeedevices.assigned_at || "",
        returned_at: employeedevices.returned_at || "",
        remarks: employeedevices.remarks || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("device-assignment.update", employeedevices.id), {
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
                Update Assign Device to Employee
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employee Name
                        </InputLabel>
                        <SelectInput
                            name="employee_id"
                            id="employee_id"
                            type="text"
                            value={data.employee_id || ""}
                            onChange={(e) =>
                                setData("employee_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Employee</option>
                            {employees &&
                                employees.map((employee) => (
                                    <option
                                        key={employee.employee_id}
                                        value={employee.employee_id}
                                    >
                                        {employee.lastname +
                                            ", " +
                                            employee.firstname}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.employee_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Device
                        </InputLabel>
                        <SelectInput
                            name="device_id"
                            id="device_id"
                            type="text"
                            value={data.device_id || ""}
                            onChange={(e) =>
                                setData("device_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Device</option>
                            {devices &&
                                devices.map((device) => (
                                    <option key={device.id} value={device.id}>
                                        {device.description}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.device_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Assigned At
                        </InputLabel>
                        <TextInput
                            name="assigned_at"
                            id="assigned_at"
                            type="date"
                            value={data.assigned_at || ""}
                            onChange={(e) =>
                                setData("assigned_at", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.assigned_at}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Returned At
                        </InputLabel>
                        <TextInput
                            name="returned_at"
                            id="returned_at"
                            type="date"
                            value={data.returned_at || ""}
                            onChange={(e) =>
                                setData("returned_at", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.returned_at}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Care Of
                        </InputLabel>
                        <SelectInput
                            name="device_careOf"
                            id="device_careOf"
                            type="text"
                            value={data.device_careOf || ""}
                            onChange={(e) =>
                                setData("device_careOf", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Employee</option>
                            {employees &&
                                employees.map((employee) => (
                                    <option
                                        key={employee.employee_id}
                                        value={employee.employee_id}
                                    >
                                        {employee.lastname +
                                            ", " +
                                            employee.firstname}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.device_careOf}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Remarks
                        </InputLabel>
                        <TextInput
                            name="remarks"
                            id="remarks"
                            type="text"
                            value={data.remarks || ""}
                            onChange={(e) => setData("remarks", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.remarks} className="mt-2" />
                    </div>
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
