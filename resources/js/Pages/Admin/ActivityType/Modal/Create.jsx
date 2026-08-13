import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { FaPlus } from "react-icons/fa";

export default function Create({ closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("activitytype.store"), {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <>
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-t-lg">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">
                    <FaPlus size={24} />
                    Add Activity Type
                </h2>
            </div>
            <form
                onSubmit={onSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* 1st column */}
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Activity
                                Type
                            </InputLabel>
                            <TextInput
                                name="name"
                                id="name"
                                type="text"
                                value={data.name || ""}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.name}
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
        </>
    );
}
