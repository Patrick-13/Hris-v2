import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { ComboBox } from "@/Components/ComboBox";

export default function Create({ employees, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: "",
        sss: "",
        philhealth: "",
        pagibig: "",
        tax: "",
        union_fee: "",
    });

    const employeeOptions = (employees || []).map((emp) => ({
        code: emp.employee_id,
        name: `${emp.lastname}, ${emp.firstname}`,
    }));

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("deduction.store"), {
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
                Add Deduction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employee
                        </InputLabel>
                        <ComboBox
                            value={data.employee_id || ""}
                            options={employeeOptions}
                            placeholder="Select Employee"
                            onChange={(selected) => {
                                setData("employee_id", selected?.code || "");
                            }}
                        />
                        <InputError
                            message={errors.employee_id}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>SSS
                        </InputLabel>
                        <TextInput
                            name="sss"
                            id="sss"
                            type="text"
                            value={data.sss || ""}
                            onChange={(e) => setData("sss", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.sss} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Phil Health
                        </InputLabel>
                        <TextInput
                            name="philhealth"
                            id="philhealth"
                            type="text"
                            value={data.philhealth || ""}
                            onChange={(e) =>
                                setData("philhealth", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.philhealth}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Pag-Ibig
                        </InputLabel>
                        <TextInput
                            name="pagibig"
                            id="pagibig"
                            type="text"
                            value={data.pagibig || ""}
                            onChange={(e) => setData("pagibig", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.pagibig} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Tax
                        </InputLabel>
                        <TextInput
                            name="tax"
                            id="tax"
                            type="text"
                            value={data.tax || ""}
                            onChange={(e) => setData("tax", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.tax} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Union
                        </InputLabel>
                        <TextInput
                            name="union_fee"
                            id="union_fee"
                            type="text"
                            value={data.union_fee || ""}
                            onChange={(e) =>
                                setData("union_fee", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.union_fee}
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
