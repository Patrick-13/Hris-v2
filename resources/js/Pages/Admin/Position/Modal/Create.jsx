import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ sections, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        post_name: "",
        post_code: "",
        sec_id: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("position.store"), {
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
                Add Position
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Position Name
                        </InputLabel>
                        <TextInput
                            name="post_name"
                            id="post_name"
                            type="text"
                            value={data.post_name || ""}
                            onChange={(e) =>
                                setData("post_name", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.post_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Code
                        </InputLabel>
                        <TextInput
                            name="post_code"
                            id="post_code"
                            type="text"
                            value={data.post_code || ""}
                            onChange={(e) =>
                                setData("post_code", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.post_code}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Section
                        </InputLabel>
                        <SelectInput
                            name="sec_id"
                            id="sec_id"
                            value={data.sec_id || ""}
                            onChange={(e) => setData("sec_id", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Section</option>
                            {sections &&
                                sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.sec_name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError message={errors.sec_id} className="mt-2" />
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
