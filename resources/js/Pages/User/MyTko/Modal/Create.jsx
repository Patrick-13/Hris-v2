import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useState } from "react";

export default function Create({ user, closeModal }) {
    const currentUser = user?.user;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: currentUser?.employee_id ?? "",
        tko_type: "",
        date: "",
        tko_time: "",
        attachment_file: null,
        remarks: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route("mytko.store"), {
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
                Apply Tko
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
                            <span className="text-red-500">*</span>Failed to
                            register?
                        </InputLabel>
                        <SelectInput
                            name="tko_type"
                            id="tko_type"
                            type="text"
                            value={data.tko_type || ""}
                            onChange={(e) =>
                                setData("tko_type", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">-Select Registry Time</option>
                            <option value="timeIn">Time In</option>
                            <option value="breakOut">Break Out</option>
                            <option value="breakIn">Break In</option>
                            <option value="timeOut">Time Out</option>
                        </SelectInput>
                        <InputError
                            message={errors.tko_type}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date
                        </InputLabel>
                        <TextInput
                            name="date"
                            id="date"
                            type="date"
                            value={data.date || ""}
                            onChange={(e) => setData("date", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />

                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Time
                        </InputLabel>
                        <TextInput
                            name="tko_time"
                            id="tko_time"
                            type="time"
                            value={data.tko_time || ""}
                            onChange={(e) =>
                                setData("tko_time", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />

                        <InputError
                            message={errors.tko_time}
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

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            Remarks
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
