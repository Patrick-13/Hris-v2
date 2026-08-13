import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Create({ auth, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        documentAttachement: "",
        number: "",
        issuedBy: "",
        issuedDate: "",
        expiryDate: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("migration.store"), {
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
                Add Migration Details
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
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel
                                htmlFor="documentAttachement"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Document Attachment
                            </InputLabel>

                            <input
                                type="file"
                                name="documentAttachement"
                                id="documentAttachement"
                                onChange={(e) =>
                                    setData(
                                        "documentAttachement",
                                        e.target.files[0]
                                    )
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />

                            <InputError
                                message={errors.documentAttachement}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Number
                            </InputLabel>
                            <TextInput
                                name="number"
                                id="number"
                                type="text"
                                value={data.number || ""}
                                onChange={(e) =>
                                    setData("number", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.number}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Issued By
                            </InputLabel>
                            <TextInput
                                name="issuedBy"
                                id="issuedBy"
                                type="text"
                                value={data.issuedBy || ""}
                                onChange={(e) =>
                                    setData("issuedBy", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.issuedBy}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Issued Date
                            </InputLabel>
                            <TextInput
                                name="issuedDate"
                                id="issuedDate"
                                type="date"
                                value={data.issuedDate || ""}
                                onChange={(e) =>
                                    setData("issuedDate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.issuedDate}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Expiry Date
                            </InputLabel>
                            <TextInput
                                name="expiryDate"
                                id="expiryDate"
                                type="date"
                                value={data.expiryDate || ""}
                                onChange={(e) =>
                                    setData("expiryDate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.expiryDate}
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
