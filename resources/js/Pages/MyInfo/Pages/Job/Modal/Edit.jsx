import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ auth, jobs, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        designation: jobs.designation || "",
        jobTitle: jobs.jobTitle || "",
        employmentStatus: jobs.employmentStatus || "",
        jobCategory: jobs.jobCategory || "",
        subUnit: jobs.subUnit || "",
        contractAttachement: null || "",
        startDate: jobs.startDate || "",
        endDate: jobs.endDate || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("job.update", jobs.id), {
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
                Edit Job Details
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
                                Designation
                            </InputLabel>
                            <SelectInput
                                name="designation"
                                id="designation"
                                type="text"
                                value={data.designation || ""}
                                onChange={(e) =>
                                    setData("designation", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Designation</option>
                                <option value="Regional Director">
                                    Regional Director
                                </option>
                                <option value="Division Chief">
                                    Division Chief
                                </option>
                                <option value="Section Chief">
                                    Section Chief
                                </option>
                                <option value="Unit Head">Unit Head</option>
                                <option value="Personnel">Personnel</option>
                            </SelectInput>
                            <InputError
                                message={errors.designation}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Job Title
                            </InputLabel>
                            <TextInput
                                name="jobTitle"
                                id="jobTitle"
                                type="text"
                                value={data.jobTitle || ""}
                                onChange={(e) =>
                                    setData("jobTitle", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.jobTitle}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Status
                            </InputLabel>
                            <SelectInput
                                name="employmentStatus"
                                id="employmentStatus"
                                type="text"
                                value={data.employmentStatus || ""}
                                onChange={(e) =>
                                    setData("employmentStatus", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Status</option>
                                <option value="Regular">Regular</option>
                                <option value="Trainee">Trainee</option>
                                <option value="Contractual">Contractual</option>
                                <option value="Job Order">Job Order</option>
                                <option value="Permanent">Permanent</option>
                                <option value="Summer Job">Summer Job</option>
                            </SelectInput>
                            <InputError
                                message={errors.employmentStatus}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Job Category
                            </InputLabel>
                            <TextInput
                                name="jobCategory"
                                id="jobCategory"
                                type="text"
                                value={data.jobCategory || ""}
                                onChange={(e) =>
                                    setData("jobCategory", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.jobCategory}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                Sub Unit
                            </InputLabel>
                            <TextInput
                                name="subUnit"
                                id="subUnit"
                                type="text"
                                value={data.subUnit || ""}
                                onChange={(e) =>
                                    setData("subUnit", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.subUnit}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="contractAttachement"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contract Attachment
                            </InputLabel>

                            <input
                                type="file"
                                name="contractAttachement"
                                id="contractAttachement"
                                onChange={(e) =>
                                    setData(
                                        "contractAttachement",
                                        e.target.files[0]
                                    )
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />

                            <InputError
                                message={errors.contractAttachement}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Start
                                Date
                            </InputLabel>
                            <TextInput
                                name="startDate"
                                id="startDate"
                                type="date"
                                value={data.startDate || ""}
                                onChange={(e) =>
                                    setData("startDate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.startDate}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                End Date
                            </InputLabel>
                            <TextInput
                                name="endDate"
                                id="startDendDateate"
                                type="date"
                                value={data.endDate || ""}
                                onChange={(e) =>
                                    setData("endDate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.endDate}
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
