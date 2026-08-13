import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";


export default function Edit({ memo, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        memo_number: memo.memo_number || "",
        date_from: memo.date_from || "",
        date_to: memo.date_to || "",
        title: memo.title || "",
        status: memo.status || "",
        provinces: memo.provinces || [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("memo.update", memo.id), {
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
                Add Memo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Memo #
                        </InputLabel>
                        <TextInput
                            name="memo_number"
                            id="memo_number"
                            type="text"
                            value={data.memo_number || ""}
                            onChange={(e) =>
                                setData("memo_number", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.memo_number}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Provinces
                        </InputLabel>
                        <MultiSelectDropdown
                            name="provinces"
                            value={data.provinces || []}
                            onChange={(values) => setData("provinces", values)}
                        >
                            <option value="">Select Provinces</option>
                            <option value="DC">Davao City</option>
                            <option value="DDN">Davao del Norte</option>
                            <option value="DDS">Davao del Sur</option>
                            <option value="DOC">Davao Occidental</option>
                            <option value="DDO">Davao de Oro</option>
                            <option value="DO">Davao Oriental</option>
                        </MultiSelectDropdown>
                        <InputError
                            message={errors.provinces}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>From
                        </InputLabel>
                        <TextInput
                            name="date_from"
                            id="date_from"
                            type="date"
                            value={data.date_from || ""}
                            onChange={(e) =>
                                setData("date_from", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.date_from}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>To
                        </InputLabel>
                        <TextInput
                            name="date_to"
                            id="date_to"
                            type="date"
                            value={data.date_to || ""}
                            onChange={(e) => setData("date_to", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.date_to} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Title
                        </InputLabel>
                        <TextInput
                            name="title"
                            id="title"
                            type="text"
                            value={data.title || ""}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Status
                        </InputLabel>
                        <TextInput
                            name="status"
                            id="status"
                            type="text"
                            value={data.status || ""}
                            onChange={(e) => setData("status", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.status} className="mt-2" />
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
