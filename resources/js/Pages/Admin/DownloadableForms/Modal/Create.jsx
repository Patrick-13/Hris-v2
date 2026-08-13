import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ formtypes, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        description: "",
        form_type: "",
        dfFile: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("downloadform.store"), {
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
                Add Downloadable Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Name
                        </InputLabel>
                        <TextInput
                            name="name"
                            id="name"
                            type="text"
                            value={data.name || ""}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>
                <div className="space-y-4">
                    {/* Description*/}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Description
                        </InputLabel>
                        <TextInput
                            name="description"
                            id="description"
                            type="text"
                            value={data.description || ""}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {/* Form Type*/}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Form Type
                        </InputLabel>
                        <SelectInput
                            name="form_type"
                            id="form_type"
                            type="text"
                            value={data.form_type || ""}
                            onChange={(e) =>
                                setData("form_type", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Form Type</option>
                            {formtypes &&
                                formtypes.map((formtype) => (
                                    <option
                                        key={formtype.id}
                                        value={formtype.id}
                                    >
                                        {formtype.name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.form_type}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>File Upload
                        </InputLabel>
                        <TextInput
                            name="dfFile"
                            id="dfFile"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                            onChange={(e) =>
                                setData("dfFile", e.target.files[0])
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.dfFile} className="mt-2" />
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
