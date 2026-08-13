import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { Select } from "@headlessui/react";
import { ComboBox } from "@/Components/ComboBox";

export default function Create({ employees, leavetypes, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: "",
        leave_type_id: "",
        year: new Date().getFullYear(),
        entitled: "",
        used: "",
        balance: "",
    });

    const employeeOptions = (employees || []).map((emp) => ({
        code: emp.employee_id,
        name: `${emp.lastname}, ${emp.firstname}`,
    }));

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("leavecredit.store"), {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <>
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-2xl font-semibold">Add Credit</h2>
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
                                <span className="text-red-500">*</span>Emplyoee
                                Id
                            </InputLabel>
                            <ComboBox
                                value={data.employee_id || ""}
                                options={employeeOptions}
                                placeholder="Select Employee"
                                onChange={(selected) => {
                                    setData(
                                        "employee_id",
                                        selected?.code || "",
                                    );
                                }}
                            />
                            <InputError
                                message={errors.employee_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Leave
                                Type
                            </InputLabel>
                            <SelectInput
                                name="leave_type_id"
                                id="leave_type_id"
                                value={data.leave_type_id || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const entitled =
                                        e.target.options[
                                            e.target.selectedIndex
                                        ].getAttribute("data-entitled");

                                    setData("leave_type_id", selectedId);
                                    // setData("entitled", entitled);
                                    // setData("balance", entitled);
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Leave Type</option>
                                {leavetypes &&
                                    leavetypes.map((leavetype) => (
                                        <option
                                            key={leavetype.id}
                                            value={leavetype.id}
                                            data-entitled={
                                                leavetype.default_entitlement
                                            }
                                        >
                                            {leavetype.name}
                                        </option>
                                    ))}
                            </SelectInput>
                            <InputError
                                message={errors.leave_type_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Year
                            </InputLabel>
                            <TextInput
                                name="year"
                                id="year"
                                type="number"
                                value={data.year || ""}
                                readOnly
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 bg-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.year}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Entitled
                            </InputLabel>
                            <TextInput
                                name="entitled"
                                id="entitled"
                                type="number"
                                value={data.entitled || ""}
                                onChange={(e) =>
                                    setData("entitled", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                            />
                            <InputError
                                message={errors.entitled}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Used
                            </InputLabel>
                            <TextInput
                                name="used"
                                id="used"
                                type="number"
                                value={data.used || ""}
                                onChange={(e) =>
                                    setData("used", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                            />
                            <InputError
                                message={errors.used}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Balance
                            </InputLabel>
                            <TextInput
                                name="balance"
                                id="balance"
                                type="number"
                                value={data.balance || ""}
                                onChange={(e) =>
                                    setData("balance", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                            />
                            <InputError
                                message={errors.balance}
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
