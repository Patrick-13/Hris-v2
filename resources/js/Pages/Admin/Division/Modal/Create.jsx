import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Create({ closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        div_name: "",
        div_code: "",
        immediate_supervisor: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("division.store"), {
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
                Add Division
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Division Name
                        </InputLabel>
                        <TextInput
                            name="div_name"
                            id="div_name"
                            type="text"
                            value={data.div_name || ""}
                            onChange={(e) =>
                                setData("div_name", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.div_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Code
                        </InputLabel>
                        <TextInput
                            name="div_code"
                            id="div_code"
                            type="text"
                            value={data.div_code || ""}
                            onChange={(e) =>
                                setData("div_code", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.div_code}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Immediate
                            Supervisor
                        </InputLabel>
                        <TextInput
                            name="immediate_supervisor"
                            id="immediate_supervisor"
                            type="text"
                            value={data.immediate_supervisor || ""}
                            onChange={(e) =>
                                setData("immediate_supervisor", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.immediate_supervisor}
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
