import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ divisions, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        sec_name: "",
        sec_code: "",
        div_id: "",
        sec_immediate_supervisor: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("section.store"), {
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
                Add Section
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Section Name
                        </InputLabel>
                        <TextInput
                            name="sec_name"
                            id="sec_name"
                            type="text"
                            value={data.sec_name || ""}
                            onChange={(e) =>
                                setData("sec_name", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.sec_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Code
                        </InputLabel>
                        <TextInput
                            name="sec_code"
                            id="sec_code"
                            type="text"
                            value={data.sec_code || ""}
                            onChange={(e) =>
                                setData("sec_code", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.sec_code}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Division
                        </InputLabel>
                        <SelectInput
                            name="div_id"
                            id="div_id"
                            value={data.div_id || ""}
                            onChange={(e) => setData("div_id", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Division</option>
                            {divisions &&
                                divisions.map((division) => (
                                    <option
                                        key={division.id}
                                        value={division.id}
                                    >
                                        {division.div_name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError message={errors.div_id} className="mt-2" />
                    </div>

                    {/* <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Immediate
                            Supervisor
                        </InputLabel>
                        <TextInput
                            name="sec_immediate_supervisor"
                            id="sec_immediate_supervisor"
                            type="text"
                            value={data.sec_immediate_supervisor || ""}
                            onChange={(e) =>
                                setData(
                                    "sec_immediate_supervisor",
                                    e.target.value
                                )
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.sec_immediate_supervisor}
                            className="mt-2"
                        />
                    </div> */}
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
