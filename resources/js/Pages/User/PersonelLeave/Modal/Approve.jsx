import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Approve({ employeeleaves, closeModal }) {
    const {
        data,
        setData,
        put,
        errors,
        reset,
        processing,
        setError,
        clearErrors,
    } = useForm({
        status: employeeleaves.status || "",
        remarks: "",
    });
    const onSubmit = (e) => {
        e.preventDefault();

        clearErrors();

        if (!data.status) {
            setError("status", "Please select a status.");
            return;
        }

        if (data.status === "rejected" && !data.remarks.trim()) {
            setError("remarks", "Remarks are required when rejecting a tko.");
            return;
        }

        put(route("employeeleave.approve", employeeleaves.id), {
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
                Are you sure to approved the leave?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Status
                        </InputLabel>
                        <SelectInput
                            name="status"
                            id="status"
                            type="text"
                            value={data.status || ""}
                            onChange={(e) => setData("status", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Leave Type</option>
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />

                        {data.status === "rejected" && (
                            <div className="mt-4">
                                <InputLabel className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span>{" "}
                                    Remarks
                                </InputLabel>

                                <textarea
                                    name="remarks"
                                    id="remarks"
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData("remarks", e.target.value)
                                    }
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="Enter remarks..."
                                />

                                <InputError
                                    message={errors.remarks}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={closeModal}
                    disabled={processing}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 disabled:opacity-50"
                >
                    Close
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing || !data.status}
                    className={`px-4 py-2 rounded shadow text-white transition ${
                        processing || !data.status
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {processing ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
}
