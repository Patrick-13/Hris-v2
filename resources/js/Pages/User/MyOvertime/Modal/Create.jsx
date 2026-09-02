import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

export default function Create({ user, closeModal }) {
    const currentUser = user?.user;
    const { data, setData, post, processing, errors, reset } = useForm({
        date_of_request: new Date().toISOString().split("T")[0],
        purpose_of_overtime: "",
        justification: "",
        attachment_file: null,
        employee_id: currentUser?.employee_id ?? "",
        request_status: "",
        worktoaccomplishments: [
            {
                work_to_accomplished: "",
                duration_hours: "",
                date_of_overtime: "",
            },
        ],
    });

    const addRow = () => {
        setData("worktoaccomplishments", [
            ...data.worktoaccomplishments,
            {
                work_to_accomplished: "",
                duration_hours: "",
                date_of_overtime: "",
            },
        ]);
    };

    const removeRow = (index) => {
        setData(
            "worktoaccomplishments",
            data.worktoaccomplishments.filter((_, i) => i !== index)
        );
    };

    const updateRow = (index, field, value) => {
        const updated = [...data.worktoaccomplishments];
        updated[index][field] = value;
        setData("worktoaccomplishments", updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("employeeovertime.store"), {
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
                Create Authority to Render Overtime
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
                            disabled
                            value={data.date_of_request || ""}
                            onChange={(e) =>
                                setData("date_of_request", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 bg-gray-300 rounded-md shadow-sm"
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
                            <span className="text-red-500">*</span>Attach File
                        </InputLabel>
                        <TextInput
                            name="attachment_file"
                            id="attachment_file"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                            onChange={(e) =>
                                setData("attachment_file", e.target.files[0])
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.attachment_file}
                            className="mt-2"
                        />
                    </div>

                    {data.worktoaccomplishments.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row md:space-x-4 mb-4"
                        >
                            {/* Work Accomplished */}
                            <div className="flex-1">
                                <InputLabel>
                                    <span className="text-red-500">*</span> Work
                                    to be accomplished
                                </InputLabel>
                                <TextInput
                                    type="text"
                                    value={item.work_to_accomplished}
                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "work_to_accomplished",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={
                                        errors?.[
                                            `worktoaccomplishments.${index}.work_to_accomplished`
                                        ]
                                    }
                                />
                            </div>

                            {/* Duration Hours */}
                            <div className="flex-1 mt-2 md:mt-0">
                                <InputLabel>
                                    <span className="text-red-500">*</span>{" "}
                                    Duration Hours
                                </InputLabel>
                                <TextInput
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    placeholder="e.g. 1.5"
                                    value={item.duration_hours}
                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "duration_hours",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={
                                        errors?.[
                                            `worktoaccomplishments.${index}.duration_hours`
                                        ]
                                    }
                                />
                            </div>

                            {/* Date of Overtime */}
                            <div className="flex-1 mt-2 md:mt-0">
                                <InputLabel>
                                    <span className="text-red-500">*</span> Date
                                    of Overtime
                                </InputLabel>
                                <TextInput
                                    type="date"
                                    value={item.date_of_overtime}
                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "date_of_overtime",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={
                                        errors?.[
                                            `worktoaccomplishments.${index}.date_of_overtime`
                                        ]
                                    }
                                />
                            </div>

                            {/* Remove button */}
                            {data.worktoaccomplishments.length > 1 && (
                                <div className="mt-2 md:mt-0 md:ml-2 self-end">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={addRow}
                        className="inline-flex items-center gap-2 px-3 py-1 border border-green-500 rounded-lg text-green-600 hover:bg-green-50 hover:shadow-md transition"
                    >
                        <FaPlusCircle size={18} className="text-green-500" />
                        <span className="font-semibold">Add More ARO</span>
                    </button>
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
