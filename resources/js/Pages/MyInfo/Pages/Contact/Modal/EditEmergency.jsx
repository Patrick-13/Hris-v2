import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function EditEmergency({ auth, contactdetails, closeModal }) {
    console.log(contactdetails);
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        fullName: contactdetails.fullName || "",
        relationship: contactdetails.relationship || "",
        phoneNumber: contactdetails.phoneNumber || "",
        workPhoneNumber: contactdetails.workPhoneNumber || "",
        mobileNumber: contactdetails.mobileNumber || "",
        status: contactdetails.status || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("emergencycontact.update", contactdetails.id), {
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
                Edit Emergency Contact
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
                                <span className="text-red-500">*</span>Fullname
                            </InputLabel>
                            <TextInput
                                name="fullName"
                                id="fullName"
                                type="text"
                                value={data.fullName || ""}
                                onChange={(e) =>
                                    setData("fullName", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.fullName}
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
                                <span className="text-red-500">*</span>Phone
                                Number
                            </InputLabel>
                            <TextInput
                                name="phoneNumber"
                                id="phoneNumber"
                                type="text"
                                value={data.phoneNumber || ""}
                                onChange={(e) =>
                                    setData("phoneNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.phoneNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Work
                                Phone #
                            </InputLabel>
                            <TextInput
                                name="workPhoneNumber"
                                id="workPhoneNumber"
                                type="text"
                                value={data.workPhoneNumber || ""}
                                onChange={(e) =>
                                    setData("workPhoneNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.workPhoneNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Mobile
                                Phone #
                            </InputLabel>
                            <TextInput
                                name="mobileNumber"
                                id="mobileNumber"
                                type="text"
                                value={data.mobileNumber || ""}
                                onChange={(e) =>
                                    setData("mobileNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.mobileNumber}
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
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
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
