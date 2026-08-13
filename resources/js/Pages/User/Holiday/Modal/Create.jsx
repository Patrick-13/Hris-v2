import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        holiday_date: "",
        name: "",
        type: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("holiday.store"), {
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
                Create Holiday
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date
                        </InputLabel>
                        <TextInput
                            name="holiday_date"
                            id="holiday_date"
                            type="date"
                            value={data.holiday_date || ""}
                            onChange={(e) =>
                                setData("holiday_date", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.holiday_date}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date
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
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date
                        </InputLabel>
                        <SelectInput
                            name="type"
                            id="type"
                            type="text"
                            value={data.type || ""}
                            onChange={(e) => setData("type", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Type</option>
                            <option value="Regular">Regular</option>
                            <option value="Special_Non">Special Non-Working</option>
                            <option value="Special_Work">Special Working</option>
                            <option value="Local">Local</option>
                        </SelectInput>
                        <InputError message={errors.type} className="mt-2" />
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
