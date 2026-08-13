import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import { useForm } from "@inertiajs/react";

export default function Create({
    employeeId,
    activityypes,
    queryParams = null,
    closeModal,
}) {
    console.log(employeeId);
    const { data, setData, post, errors, reset } = useForm({
        title_id: "",
        soNumber: "",
        dateFrom: "",
        dateTo: "",
        noofHours: "",
        type: "",
        venue: "",
        description: "",
        employees: [employeeId],
    });

    const selectedActivityType = activityypes?.find(
        (activitytype) => activitytype.id == data.title_id,
    );

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("myactivity.store"), {
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
                Add Activity
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>
                        {selectedActivityType?.name?.toLowerCase() ===
                        "trip ticket"
                            ? "T.T #"
                            : "S.O #"}
                    </InputLabel>
                    <TextInput
                        name="soNumber"
                        id="soNumber"
                        type="text"
                        value={data.soNumber || ""}
                        onChange={(e) => setData("soNumber", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.soNumber} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Activity Type
                    </InputLabel>
                    <SelectInput
                        name="title_id"
                        id="title_id"
                        type="text"
                        value={data.title_id || ""}
                        onChange={(e) => setData("title_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Activity Type</option>
                        {activityypes &&
                            activityypes.map((activitytype) => (
                                <option
                                    key={activitytype.id}
                                    value={activitytype.id}
                                >
                                    {activitytype.name}
                                </option>
                            ))}
                    </SelectInput>
                    <InputError message={errors.title_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Type
                    </InputLabel>
                    <SelectInput
                        name="type"
                        id="type"
                        value={data.type || ""}
                        onChange={(e) => setData("type", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Tyte</option>
                        <option value="internal">Internal</option>
                        <option value="external">External</option>
                    </SelectInput>
                    <InputError message={errors.type} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>No of Hours
                    </InputLabel>
                    <TextInput
                        name="noofHours"
                        id="noofHours"
                        type="text"
                        value={data.noofHours || ""}
                        onChange={(e) => setData("noofHours", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.noofHours} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Date From
                    </InputLabel>
                    <TextInput
                        name="dateFrom"
                        id="dateFrom"
                        type="date"
                        value={data.dateFrom || ""}
                        onChange={(e) => setData("dateFrom", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.dateFrom} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Date To
                    </InputLabel>
                    <TextInput
                        name="dateTo"
                        id="dateTo"
                        type="date"
                        value={data.dateTo || ""}
                        onChange={(e) => setData("dateTo", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.dateTo} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Venue
                    </InputLabel>
                    <TextInput
                        name="venue"
                        id="venue"
                        type="text"
                        value={data.venue || ""}
                        onChange={(e) => setData("venue", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.venue} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Description
                    </InputLabel>
                    <TextInput
                        name="description"
                        id="description"
                        type="text"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.description} className="mt-2" />
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
