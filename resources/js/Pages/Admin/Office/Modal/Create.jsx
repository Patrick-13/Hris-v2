import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { FaPlus } from "react-icons/fa";

export default function Create({ closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        office_code: "",
        office_name: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "",
        is_active: 1
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("office.store"), {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <>
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-t-lg">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">
                    <FaPlus size={24} />
                    Add Office
                </h2>
            </div>
            <form
                onSubmit={onSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* 1st column */}
                    <div className="space-y-4">
                        {/* Office Code */}
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Office
                                Code
                            </InputLabel>
                            <TextInput
                                name="office_code"
                                id="office_code"
                                type="text"
                                value={data.office_code || ""}
                                onChange={(e) =>
                                    setData("office_code", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.office_code}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Office
                                Name
                            </InputLabel>
                            <TextInput
                                name="office_name"
                                id="office_name"
                                type="text"
                                value={data.office_name || ""}
                                onChange={(e) =>
                                    setData("office_name", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.office_name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Address
                            </InputLabel>
                            <TextInput
                                name="address"
                                id="address"
                                type="text"
                                value={data.address || ""}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Latitude
                            </InputLabel>
                            <TextInput
                                name="latitude"
                                id="latitude"
                                type="text"
                                value={data.latitude || ""}
                                onChange={(e) =>
                                    setData("latitude", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.latitude}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Longitude
                            </InputLabel>
                            <TextInput
                                name="longitude"
                                id="longitude"
                                type="text"
                                value={data.longitude || ""}
                                onChange={(e) =>
                                    setData("longitude", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.tel_number}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Radius
                            </InputLabel>
                            <TextInput
                                name="radius"
                                id="radius"
                                type="text"
                                value={data.radius || ""}
                                onChange={(e) =>
                                    setData("radius", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.radius}
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
        </>
    );
}
