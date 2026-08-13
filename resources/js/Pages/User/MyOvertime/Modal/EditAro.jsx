import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

export default function EditAro({ employeeovertimes, closeModal }) {
    console.log(employeeovertimes);
    const { data, setData, post, errors, reset } = useForm({
        duration_hours: employeeovertimes.duration_hours,
        work_accomplished: employeeovertimes.work_accomplished,
        attachment: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(
            route("employeeovertimeccomplishment.update", employeeovertimes.id),
            {
                ...data,
                _method: "PUT",
            },
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
                Accomplishment Report for Render Overtime Edit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}

                <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                    {/* Work Accomplished */}
                    <div className="flex-1">
                        <InputLabel>
                            <span className="text-red-500">*</span> Work
                            Accomplished
                        </InputLabel>
                        <TextInput
                            type="text"
                            value={data.work_accomplished}
                            onChange={(e) =>
                                setData("work_accomplished", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.work_accomplished}
                            className="mt-2"
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

                    <div className="flex-1 mt-2 md:mt-0">
                        <InputLabel>
                            <span className="text-red-500">*</span>Attach File
                        </InputLabel>
                        <TextInput
                            name="attachment"
                            id="attachment"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                            onChange={(e) =>
                                setData("attachment", e.target.files[0])
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.attachment}
                            className="mt-2"
                        />
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
