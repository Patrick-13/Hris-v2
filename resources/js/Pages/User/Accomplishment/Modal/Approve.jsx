import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { useOvertimeNotifications } from "@/Contexts/OvertimeApprovalContext";

export default function Approve({ employeeovertimes, closeModal }) {
    console.log(employeeovertimes);

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
        status: "",
        remarks: "",
    });

    const { fetchPending } = useOvertimeNotifications();

    const onSubmit = (e) => {
        e.preventDefault();

        clearErrors();

        if (!data.status) {
            setError("status", "Please select a status.");
            return;
        }

        if (data.status === "returned" && !data.remarks.trim()) {
            setError(
                "remarks",
                "Remarks are required when returning an Accomplishment."
            );
            return;
        }

        put(route("aro.approve", employeeovertimes.id), {
            onSuccess: () => {
                fetchPending();
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
                Are you sure you want to approve this overtime?
            </h2>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span> Status
                        </InputLabel>

                        <SelectInput
                            name="status"
                            id="status"
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Status</option>
                            <option value="approved">Approved</option>
                            <option value="returned">Returned</option>
                        </SelectInput>

                        <InputError message={errors.status} className="mt-2" />

                        {data.status === "returned" && (
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
                <button
                    type="button"
                    onClick={closeModal}
                    disabled={processing}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 disabled:opacity-50"
                >
                    Close
                </button>

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
