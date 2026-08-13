import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Edit({ auth, dependents,closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        lastName: dependents.lastName || "",
        firstName: dependents.firstName || "",
        middleName: dependents.middleName || "",
        relationship: dependents.relationship || "",
        dateofBirth: dependents.dateofBirth || "",
        status: dependents.status || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("dependent.update", dependents.id), {
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
                Edit Dependent
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
                                <span className="text-red-500">*</span>Lastname
                            </InputLabel>
                            <TextInput
                                name="lastName"
                                id="lastName"
                                type="text"
                                value={data.lastName || ""}
                                onChange={(e) =>
                                    setData("lastName", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.lastName}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Firstname
                            </InputLabel>
                            <TextInput
                                name="firstName"
                                id="firstName"
                                type="text"
                                value={data.firstName || ""}
                                onChange={(e) =>
                                    setData("firstName", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.firstName}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Middlename
                            </InputLabel>
                            <TextInput
                                name="middleName"
                                id="middleName"
                                type="text"
                                value={data.middleName || ""}
                                onChange={(e) =>
                                    setData("middleName", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.middleName}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Relationship Type
                            </InputLabel>
                            <SelectInput
                                name="relationship"
                                id="relationship"
                                type="text"
                                value={data.relationship || ""}
                                onChange={(e) =>
                                    setData("relationship", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Relationship</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                            </SelectInput>
                            <InputError
                                message={errors.relationship}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Date of
                                Birth
                            </InputLabel>
                            <TextInput
                                name="dateofBirth"
                                id="dateofBirth"
                                type="date"
                                value={data.dateofBirth || ""}
                                onChange={(e) =>
                                    setData("dateofBirth", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.dateofBirth}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Status
                            </InputLabel>
                            <SelectInput
                                name="status"
                                id="status"
                                type="text"
                                value={data.status || ""}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Status</option>
                                <option value="0">Active</option>
                                <option value="1">Inactive</option>
                            </SelectInput>
                            <InputError
                                message={errors.status}
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
