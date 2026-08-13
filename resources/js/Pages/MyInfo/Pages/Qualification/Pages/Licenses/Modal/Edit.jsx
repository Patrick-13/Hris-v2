import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Edit({ auth, licenses, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        cse: licenses.cse || "",
        rating: licenses.rating || "",
        placeExamTaken: licenses.placeExamTaken || "",
        dateTaken: licenses.dateTaken || "",
        profLicenseNumber: licenses.profLicenseNumber || "",
        dateRelease: licenses.dateRelease || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("eligibility.update", licenses.id), {
            forceFormData: true,
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
                Edit Eligibility/License Details
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
                                <span className="text-red-500">*</span>CSE
                            </InputLabel>
                            <TextInput
                                name="cse"
                                id="cse"
                                type="text"
                                value={data.cse || ""}
                                onChange={(e) => setData("cse", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError message={errors.cse} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Rating
                            </InputLabel>
                            <TextInput
                                name="rating"
                                id="rating"
                                type="text"
                                value={data.rating || ""}
                                onChange={(e) =>
                                    setData("rating", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.rating}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Place Exam Taken
                            </InputLabel>
                            <TextInput
                                name="placeExamTaken"
                                id="placeExamTaken"
                                type="text"
                                value={data.placeExamTaken || ""}
                                onChange={(e) =>
                                    setData("placeExamTaken", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.placeExamTaken}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Date Taken
                            </InputLabel>
                            <TextInput
                                name="dateTaken"
                                id="dateTaken"
                                type="date"
                                value={data.dateTaken || ""}
                                onChange={(e) =>
                                    setData("dateTaken", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.dateTaken}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Professional License Number
                            </InputLabel>
                            <TextInput
                                name="profLicenseNumber"
                                id="profLicenseNumber"
                                type="text"
                                value={data.profLicenseNumber || ""}
                                onChange={(e) =>
                                    setData("profLicenseNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.profLicenseNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                Date Release
                            </InputLabel>
                            <TextInput
                                name="dateRelease"
                                id="dateRelease"
                                type="date"
                                value={data.dateRelease || ""}
                                onChange={(e) =>
                                    setData("dateRelease", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.dateRelease}
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
