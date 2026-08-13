import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import ImageUploader from "@/Components/ImageUploader";
import ShowImageUpload from "@/Components/ShowImageUpload";

export default function Show({ categories, employeedevices, closeModal }) {
    const { data, setData, put, errors, reset } = useForm({
        fundType: employeedevices.device_by.fundType || "",
        ppeType: employeedevices.device_by.ppeType || "",
        parNo: employeedevices.device_by.parNo || "",
        description: employeedevices.device_by.description || "",
        serial_number: employeedevices.device_by.serial_number || "",
        property_number: employeedevices.device_by.property_number || "",
        category_id: employeedevices.device_by.category_id || "",
        unitofMeasure: employeedevices.device_by.unitofMeasure || "",
        brand: employeedevices.device_by.brand || "",
        status: employeedevices.device_by.status || "",
        price: employeedevices.device_by.price || "",
        images: employeedevices.device_by.images
            ? employeedevices.device_by.images.map((img) => `/${img}`)
            : [],
        remarks: employeedevices.device_by.remarks || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all form fields
        Object.keys(data).forEach((key) => {
            if (key !== "images") {
                formData.append(key, data[key] ?? "");
            }
        });

        // Append multiple images if selected
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append(`images[${i}]`, data.images[i]);
            }
        }

        put(route("device.update", devices.id), {
            data: formData,
            forceFormData: true, // Important for file uploads in Inertia
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
                Device Information
            </h2>
            {/* 1st row */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Fund Type
                    </InputLabel>
                    <TextInput
                        name="fundType"
                        id="fundType"
                        type="text"
                        value={data.fundType || ""}
                        onChange={(e) => setData("fundType", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.fundType} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>PPE Type
                    </InputLabel>
                    <TextInput
                        name="ppeType"
                        id="ppeType"
                        type="text"
                        value={data.ppeType || ""}
                        onChange={(e) => setData("ppeType", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.ppeType} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Par No
                    </InputLabel>
                    <TextInput
                        name="parNo"
                        id="parNo"
                        type="text"
                        value={data.parNo || ""}
                        onChange={(e) => setData("parNo", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.parNo} className="mt-2" />
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
                        readOnly
                        onChange={(e) => setData("description", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Serial Number
                    </InputLabel>
                    <TextInput
                        name="serial_number"
                        id="serial_number"
                        type="text"
                        value={data.serial_number || ""}
                        readOnly
                        onChange={(e) =>
                            setData("serial_number", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError
                        message={errors.serial_number}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Property Number
                    </InputLabel>
                    <TextInput
                        name="property_number"
                        id="property_number"
                        type="text"
                        value={data.property_number || ""}
                        readOnly
                        onChange={(e) =>
                            setData("property_number", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError
                        message={errors.property_number}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Unit of Measure
                    </InputLabel>
                    <TextInput
                        name="unitofMeasure"
                        id="unitofMeasure"
                        type="text"
                        value={data.unitofMeasure || ""}
                        onChange={(e) =>
                            setData("unitofMeasure", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError
                        message={errors.unitofMeasure}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Category
                    </InputLabel>
                    <SelectInput
                        name="category_id"
                        id="category_id"
                        type="text"
                        value={data.category_id || ""}
                        readOnly
                        onChange={(e) => setData("category_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Category</option>
                        {categories &&
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </SelectInput>
                    <InputError message={errors.category_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Brand
                    </InputLabel>
                    <TextInput
                        name="brand"
                        id="brand"
                        type="text"
                        value={data.brand || ""}
                        readOnly
                        onChange={(e) => setData("brand", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.status} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Status
                    </InputLabel>
                    <SelectInput
                        name="status"
                        id="status"
                        type="text"
                        value={data.status || ""}
                        readOnly
                        onChange={(e) => setData("status", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Status</option>
                        <option value="available">Available</option>
                        <option value="assigned">Assigned</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </SelectInput>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>Price
                    </InputLabel>
                    <TextInput
                        name="price"
                        id="price"
                        type="text"
                        value={data.price || ""}
                        readOnly
                        onChange={(e) => setData("price", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.price} className="mt-2" />
                </div>
                <div>
                    <InputLabel className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span>remarks
                    </InputLabel>
                    <TextInput
                        name="remarks"
                        id="remarks"
                        type="text"
                        value={data.remarks || ""}
                        readOnly
                        onChange={(e) => setData("remarks", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    <InputError message={errors.remarks} className="mt-2" />
                </div>
            </div>

            {/* 2nd row */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mt-6">
                <div>
                    <ShowImageUpload
                        label="Images"
                        name="images"
                        value={data.images}
                        error={errors.images}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                >
                    Close
                </button>
            </div>
        </form>
    );
}
