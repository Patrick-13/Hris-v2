import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ submodules, modules, closeModal }) {
    console.log(modules);
    const { data, setData, put, errors, reset } = useForm({
        submoduleName: submodules.submoduleName || "",
        module_id: submodules.module_id || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("submodule.update", submodules.id), {
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
                Update Sub Module
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Sub Module
                            Name
                        </InputLabel>
                        <TextInput
                            name="submoduleName"
                            id="submoduleName"
                            type="text"
                            value={data.submoduleName || ""}
                            onChange={(e) =>
                                setData("submoduleName", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.submoduleName}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Module Name
                        </InputLabel>
                        <SelectInput
                            name="module_id"
                            id="module_id"
                            type="text"
                            value={data.module_id || ""}
                            onChange={(e) =>
                                setData("module_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Module</option>
                            {modules &&
                                modules.map((module) => (
                                    <option key={module.id} value={module.id}>
                                        {module.moduleName}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.module_id}
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
