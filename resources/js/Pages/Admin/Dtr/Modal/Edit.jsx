import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Edit({ dtrs, closeModal }) {
    const formatTime = (time) => {
        if (!time) return "";
        return time.slice(0, 5); // remove seconds
    };

    const { data, setData, put, errors, reset } = useForm({
        timeIn: formatTime(dtrs.timeIn),
        breakOut: formatTime(dtrs.breakOut),
        breakIn: formatTime(dtrs.breakIn),
        timeOut: formatTime(dtrs.timeOut),
    });

    const date = dtrs?.punch_date ? dtrs.punch_date.slice(0, 10) : "";

    const fullName = dtrs?.employeeTransaction
        ? `${dtrs.employeeTransaction.firstname} ${dtrs.employeeTransaction.middlename ?? ""} ${dtrs.employeeTransaction.lastname}`
        : "";

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        put(route("dtr.update", dtrs.id), {
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
                Edit Dtr
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            Full Name
                        </InputLabel>

                        <TextInput
                            type="text"
                            value={fullName}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                    </div>
                    {/* date*/}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            Date
                        </InputLabel>

                        <TextInput
                            type="date"
                            value={date}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                    </div>
                    {/* timeIn*/}
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>TimeIn
                        </InputLabel>
                        <TextInput
                            name="timeIn"
                            id="timeIn"
                            type="time"
                            value={data.timeIn || ""}
                            readOnly={!!data.timeIn}
                            onChange={(e) => setData("timeIn", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.timeIn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Break Out
                        </InputLabel>
                        <TextInput
                            name="breakOut"
                            id="breakOut"
                            type="time"
                            value={data.breakOut || ""}
                            readOnly={!!data.breakOut}
                            onChange={(e) =>
                                setData("breakOut", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.breakOut}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Break In
                        </InputLabel>
                        <TextInput
                            name="breakIn"
                            id="breakIn"
                            type="time"
                            value={data.breakIn || ""}
                            readOnly={!!data.breakIn}
                            onChange={(e) => setData("breakIn", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.breakIn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Time Out
                        </InputLabel>
                        <TextInput
                            name="timeOut"
                            id="timeOut"
                            type="time"
                            value={data.timeOut || ""}
                            readOnly={!!data.timeOut}
                            onChange={(e) => setData("timeOut", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.timeOut} className="mt-2" />
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
