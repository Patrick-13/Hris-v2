import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Edit({ auth, educations, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        educationLevel: educations.educationLevel || "",
        schoolName: educations.schoolName || "",
        degree: educations.degree || "",
        yeargraduate: educations.yeargraduate || "",
        highestlevel: educations.highestlevel || "",
        unitsEarned: educations.unitsEarned || "",
        dateFrom: educations.dateFrom || "",
        dateTo: educations.dateTo || "",
        scholarship_honors: educations.scholarship_honors || "",
        isGraduated: educations.isGraduated || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("education.update", educations.id), {
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
                Add Migration Details
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
                                <span className="text-red-500">*</span>Education
                                Level
                            </InputLabel>
                            <SelectInput
                                name="educationLevel"
                                id="educationLevel"
                                type="text"
                                value={data.educationLevel || ""}
                                onChange={(e) =>
                                    setData("educationLevel", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Level</option>
                                <option value="Elementary">Elementary</option>
                                <option value="Secondary">Secondary</option>
                                <option value="Vocational/Trade Course">
                                    Vocational/Trade Course
                                </option>
                                <option value="College">College</option>
                                <option value="Graduate Studies">
                                    Graduate Studies
                                </option>
                            </SelectInput>
                            <InputError
                                message={errors.educationLevel}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                School Name
                            </InputLabel>
                            <TextInput
                                name="schoolName"
                                id="schoolName"
                                type="text"
                                value={data.schoolName || ""}
                                onChange={(e) =>
                                    setData("schoolName", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.schoolName}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Degree
                            </InputLabel>
                            <TextInput
                                name="degree"
                                id="degree"
                                type="text"
                                value={data.degree || ""}
                                onChange={(e) =>
                                    setData("degree", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.degree}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Year Graduate
                            </InputLabel>
                            <TextInput
                                name="yeargraduate"
                                id="yeargraduate"
                                type="text"
                                value={data.yeargraduate || ""}
                                onChange={(e) =>
                                    setData("yeargraduate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.yeargraduate}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Highest Level
                            </InputLabel>
                            <TextInput
                                name="highestlevel"
                                id="highestlevel"
                                type="text"
                                value={data.highestlevel || ""}
                                onChange={(e) =>
                                    setData("highestlevel", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.highestlevel}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Units Earned
                            </InputLabel>
                            <TextInput
                                name="unitsEarned"
                                id="unitsEarned"
                                type="text"
                                value={data.unitsEarned || ""}
                                onChange={(e) =>
                                    setData("unitsEarned", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.unitsEarned}
                                className="mt-2"
                            />
                        </div>
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
                                Scholarship/Honors
                            </InputLabel>
                            <TextInput
                                name="scholarship_honors"
                                id="scholarship_honors"
                                type="text"
                                value={data.scholarship_honors || ""}
                                onChange={(e) =>
                                    setData(
                                        "scholarship_honors",
                                        e.target.value
                                    )
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
                                is Graduated?
                            </InputLabel>
                            <SelectInput
                                name="isGraduated"
                                id="isGraduated"
                                type="text"
                                value={data.isGraduated || ""}
                                onChange={(e) =>
                                    setData("isGraduated", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Yes/No?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </SelectInput>
                            <InputError
                                message={errors.isGraduated}
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
