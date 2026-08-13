import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Create({
    employeemovements,
    companys,
    personelemployees,
    divisions,
    sections,
    positions,
    closeModal,
}) {
    const { data, setData, put, errors, reset } = useForm({
        designation: employeemovements?.employee_by?.employee_job_by?.[0]?.designation ?? "",
        company_id: employeemovements?.company_id || "",
        employee_id: employeemovements?.employee_id || "",
        division_id: employeemovements?.division_id || "",
        section_id: employeemovements?.section_id || "",
        position_id: employeemovements?.position_id || "",
        employmentStatus: employeemovements?.employee_by?.employee_job_by?.[0]?.employmentStatus ?? "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("employeemovement.update", employeemovements.id), {
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
                Edit Employee Movement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
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
                            <option value="Section Chief">Section Chief</option>
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
                            <span className="text-red-500">*</span>Company Name
                        </InputLabel>
                        <SelectInput
                            name="company_id"
                            id="company_id"
                            type="text"
                            value={data.company_id || ""}
                            onChange={(e) =>
                                setData("company_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Company</option>
                            {companys &&
                                companys.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.company_id}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employee
                        </InputLabel>
                        <SelectInput
                            name="employee_id"
                            id="employee_id"
                            type="text"
                            value={data.employee_id || ""}
                            onChange={(e) =>
                                setData("employee_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Employee</option>
                            {personelemployees &&
                                personelemployees.map((personelemployee) => (
                                    <option
                                        key={personelemployee.employee_id}
                                        value={personelemployee.employee_id}
                                    >
                                        {personelemployee.lastname +
                                            ", " +
                                            personelemployee.firstname}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.employee_id}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Division
                        </InputLabel>
                        <SelectInput
                            name="division_id"
                            id="division_id"
                            type="text"
                            value={data.division_id || ""}
                            onChange={(e) =>
                                setData("division_id", e.target.value)
                            }
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
                        <InputError
                            message={errors.division_id}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Section
                        </InputLabel>
                        <SelectInput
                            name="section_id"
                            id="section_id"
                            type="text"
                            value={data.section_id || ""}
                            onChange={(e) =>
                                setData("section_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Section</option>
                            {sections &&
                                sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.sec_name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.section_id}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Position
                        </InputLabel>
                        <SelectInput
                            name="position_id"
                            id="position_id"
                            type="text"
                            value={data.position_id || ""}
                            onChange={(e) =>
                                setData("position_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Position</option>
                            {positions &&
                                positions.map((position) => (
                                    <option
                                        key={position.id}
                                        value={position.id}
                                    >
                                        {position.post_name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.position_id}
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
