import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Edit({ auth, salarys, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        salarySchedule: salarys.salarySchedule || "",
        payGrade: salarys.payGrade || "",
        steps: salarys.steps || "",
        amount: salarys.amount || "",
        salaryComponent: salarys.salaryComponent || "",
        payFrequency: salarys.payFrequency || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("salary.update", salarys.id), {
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
                Add Salary Details
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
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Salary Schedule
                            </InputLabel>
                            <TextInput
                                name="salarySchedule"
                                id="salarySchedule"
                                type="text"
                                value={data.salarySchedule || ""}
                                onChange={(e) =>
                                    setData("salarySchedule", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.designation}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Pay Grade
                            </InputLabel>
                            <TextInput
                                name="payGrade"
                                id="payGrade"
                                type="text"
                                value={data.payGrade || ""}
                                onChange={(e) =>
                                    setData("payGrade", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.payGrade}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Steps
                            </InputLabel>
                            <TextInput
                                name="steps"
                                id="steps"
                                type="text"
                                value={data.steps || ""}
                                onChange={(e) =>
                                    setData("steps", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />

                            <InputError
                                message={errors.steps}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Amount
                            </InputLabel>
                            <TextInput
                                name="amount"
                                id="amount"
                                type="text"
                                value={data.amount || ""}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.amount}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Salary Component
                            </InputLabel>
                            <TextInput
                                name="salaryComponent"
                                id="salaryComponent"
                                type="text"
                                value={data.salaryComponent || ""}
                                onChange={(e) =>
                                    setData("salaryComponent", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.salaryComponent}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Pay Frequency
                            </InputLabel>
                            <TextInput
                                name="payFrequency"
                                id="payFrequency"
                                type="text"
                                value={data.payFrequency || ""}
                                onChange={(e) =>
                                    setData("payFrequency", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.payFrequency}
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
