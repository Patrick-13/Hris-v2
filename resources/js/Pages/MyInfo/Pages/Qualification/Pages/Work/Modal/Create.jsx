import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({ auth, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        dateFrom: "",
        dateTo: "",
        jobTitle: "",
        emp_status: "",
        isGovernment: false,
        department: "",
        agency: "",
        office: "",
        company: "",
        branch: "",
        leave_absent: "",
        monthysalary: "",
        paycolumngrade: "",
        separationCause: "",
        isActive: false,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("workexperience.store"), {
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
                Add Work Experience Details
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
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Date From
                            </InputLabel>
                            <TextInput
                                name="dateFrom"
                                id="dateFrom"
                                type="date"
                                value={data.dateFrom || ""}
                                onChange={(e) =>
                                    setData("dateFrom", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.dateFrom}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Date To
                            </InputLabel>
                            <TextInput
                                name="dateTo"
                                id="dateTo"
                                type="date"
                                value={data.dateTo || ""}
                                onChange={(e) =>
                                    setData("dateTo", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.dateTo}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Job Title
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
                                <span className="text-red-500">*</span>Emp
                                Status
                            </InputLabel>
                            <SelectInput
                                name="emp_status"
                                id="emp_status"
                                type="text"
                                value={data.emp_status || ""}
                                onChange={(e) =>
                                    setData("emp_status", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Level</option>
                                <option value="regular">Regular</option>
                                <option value="trainee">Trainee</option>
                                <option value="contractual">Contractual</option>
                                <option value="job order">Job Order</option>
                                <option value="permanent">Permanent</option>
                                <option value="summer job">Summber Job</option>
                            </SelectInput>
                            <InputError
                                message={errors.emp_status}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Is Government?
                            </InputLabel>
                            <SelectInput
                                name="isGovernment"
                                id="isGovernment"
                                type="text"
                                value={data.isGovernment || ""}
                                onChange={(e) =>
                                    setData("isGovernment", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Yes/No?</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </SelectInput>
                            <InputError
                                message={errors.isGovernment}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Department
                            </InputLabel>
                            <TextInput
                                name="department"
                                id="department"
                                type="text"
                                value={data.department || ""}
                                onChange={(e) =>
                                    setData("department", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.department}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Agency
                            </InputLabel>
                            <TextInput
                                name="agency"
                                id="agency"
                                type="text"
                                value={data.agency || ""}
                                onChange={(e) =>
                                    setData("agency", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.agency}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Office
                            </InputLabel>
                            <TextInput
                                name="office"
                                id="office"
                                type="text"
                                value={data.office || ""}
                                onChange={(e) =>
                                    setData("office", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.office}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Company
                            </InputLabel>
                            <TextInput
                                name="company"
                                id="company"
                                type="text"
                                value={data.company || ""}
                                onChange={(e) =>
                                    setData("company", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.company}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Branch
                            </InputLabel>
                            <TextInput
                                name="branch"
                                id="branch"
                                type="text"
                                value={data.branch || ""}
                                onChange={(e) =>
                                    setData("branch", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.branch}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Leave Absent
                            </InputLabel>
                            <TextInput
                                name="leave_absent"
                                id="leave_absent"
                                type="text"
                                value={data.leave_absent || ""}
                                onChange={(e) =>
                                    setData("leave_absent", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.leave_absent}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Monthly Salary
                            </InputLabel>
                            <TextInput
                                name="monthysalary"
                                id="monthysalary"
                                type="text"
                                value={data.monthysalary || ""}
                                onChange={(e) =>
                                    setData("monthysalary", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.monthysalary}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Pay Grade
                            </InputLabel>
                            <TextInput
                                name="paycolumngrade"
                                id="paycolumngrade"
                                type="text"
                                value={data.paycolumngrade || ""}
                                onChange={(e) =>
                                    setData("paycolumngrade", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.paycolumngrade}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Separtion Cause
                            </InputLabel>
                            <TextInput
                                name="separationCause"
                                id="separationCause"
                                type="text"
                                value={data.separationCause || ""}
                                onChange={(e) =>
                                    setData("separationCause", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.separationCause}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                is Active?
                            </InputLabel>
                            <SelectInput
                                name="isActive"
                                id="isActive"
                                type="text"
                                value={data.isActive || ""}
                                onChange={(e) =>
                                    setData("isActive", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Yes/No?</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </SelectInput>
                            <InputError
                                message={errors.isActive}
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
