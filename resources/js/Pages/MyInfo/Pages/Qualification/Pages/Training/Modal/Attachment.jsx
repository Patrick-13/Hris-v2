import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Attachment({ auth, trainingfiles, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        training_id: trainingfiles.id,
        ilrFile: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("trainingfile.store"), {
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
            <h2 className="text-2xl font-semibold mb-6 text-white bg-blue-500 p-4 rounded-lg">
                Attach Learning Report
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}

                <div className="space-y-4">
                    <div>
                        <TextInput
                            name="employee_id"
                            id="employee_id"
                            type="hidden"
                            value={data.employee_id || ""}
                            onChange={(e) =>
                                setData("employee_id", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <TextInput
                            name="training_id"
                            id="training_id"
                            type="hidden"
                            value={data.training_id || ""}
                            onChange={(e) =>
                                setData("training_id", e.target.value)
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Attach
                                File
                            </InputLabel>
                            <input
                                type="file"
                                name="ilrFile"
                                id="ilrFile"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                    setData("ilrFile", e.target.files[0])
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.ilrFile}
                                className="mt-2"
                            />

                            <InputError
                                message={errors.ilrFile}
                                className="mt-2"
                            />
                        </div>
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
