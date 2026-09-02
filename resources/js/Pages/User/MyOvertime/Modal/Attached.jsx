import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

export default function Attached({ employeeovertimes, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        fullname:
            employeeovertimes.data[0].employeeBy.firstname +
            " " +
            employeeovertimes.data[0].employeeBy.lastname,
        date_of_overtime: employeeovertimes.data[0].date_of_overtime,

        accomplishments: [
            {
                work_accomplished: "",
                duration_hours: "",
                attachment: null,
            },
        ],
    });
    console.log(employeeovertimes);

    const addRow = () => {
        setData("accomplishments", [
            ...data.accomplishments,
            { work_accomplished: "", duration_hours: "", attachment: null },
        ]);
    };

    const removeRow = (index) => {
        setData(
            "accomplishments",
            data.accomplishments.filter((_, i) => i !== index)
        );
    };

    const updateRow = (index, field, value) => {
        const updated = [...data.accomplishments];
        updated[index][field] = value;
        setData("accomplishments", updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(
            route(
                "employeeovertime.accomplishment",
                employeeovertimes.data[0].id
            ),
            {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    reset();
                },
            }
        );
    };

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Accomplishment Report for Render Overtime
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Name of Employee
                    </InputLabel>
                    <TextInput
                        name="fullname"
                        id="fullname"
                        type="text"
                        disabled
                        value={data.fullname}
                        onChange={(e) => setData("fullname", e.target.value)}
                        className="mt-1 block w-full border-gray-300 bg-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.fullname} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Date of Overtime
                    </InputLabel>
                    <TextInput
                        name="date_of_overtime"
                        id="date_of_overtime"
                        type="date"
                        disabled
                        value={data.date_of_overtime}
                        onChange={(e) =>
                            setData("date_of_overtime", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 bg-gray-300 rounded-md shadow-sm"
                    />
                    <InputError
                        message={errors.date_of_overtime}
                        className="mt-2"
                    />
                </div>
                {data.accomplishments.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:space-x-4 mb-4"
                    >
                        {/* Work Accomplished */}
                        <div className="flex-1">
                            <InputLabel>
                                <span className="text-red-500">*</span> Work
                                Accomplished
                            </InputLabel>
                            <TextInput
                                type="text"
                                value={item.work_accomplished}
                                onChange={(e) =>
                                    updateRow(
                                        index,
                                        "work_accomplished",
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={
                                    errors?.[
                                        `accomplishments.${index}.work_accomplished`
                                    ]
                                }
                            />
                        </div>

                        {/* Duration Hours */}
                        <div className="flex-1 mt-2 md:mt-0">
                            <InputLabel>
                                <span className="text-red-500">*</span> Duration
                                Hours
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
                                        `accomplishments.${index}.duration_hours`
                                    ]
                                }
                            />
                        </div>

                        <div className="flex-1 mt-2 md:mt-0">
                            <InputLabel>
                                <span className="text-red-500">*</span>Attach
                                File
                            </InputLabel>
                            <TextInput
                                name="attachment"
                                id="attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                                onChange={(e) =>
                                    updateRow(
                                        index,
                                        "attachment",
                                        e.target.files[0]
                                    )
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                Note: PDF files only. Maximum file size is 20
                                MB.
                            </p>

                            <InputError
                                message={
                                    errors?.[
                                        `accomplishments.${index}.attachment`
                                    ]
                                }
                            />
                        </div>

                        {/* Remove button */}
                        {data.accomplishments.length > 1 && (
                            <div className="mt-2 md:mt-0 md:ml-2 self-end">
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addRow}
                className="text-blue-600 text-sm hover:underline"
            >
                + Add another accomplishment
            </button>
            <div className="mt-6 flex justify-end space-x-4">
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                >
                    close
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
