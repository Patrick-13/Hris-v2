import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import SelectInput from "@/Components/SelectInput";
import { ComboBox } from "@/Components/ComboBox";

export default function Create({ auth, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: auth.user.employee_id,
        addressType: "",
        country: "Philippines",
        province: "",
        city: "",
        barangay: "",
        street: "",
        houseNumber: "",
        workemail: "",
        otheremail: "",
        workphoneNumber: "",
        homephoneNumber: "",
        mobileNumber: "",
    });

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Fetch Regions on mount
    useEffect(() => {
        axios
            .get("/user/regions")
            .then((res) => setRegions(res.data))
            .catch((err) => console.error("Error fetching regions", err));
    }, []);

    // Fetch Provinces when region code changes
    useEffect(() => {
        if (data.region) {
            axios
                .get(`/user/regions/${data.region}/provinces/`)
                .then((res) => setProvinces(res.data));
        } else {
            setProvinces([]);
            setCities([]);
            setDistricts([]);
            setData((prev) => ({
                ...prev,
                province: "",
                provinceName: "",
                cityMunicipalityCode: "",
                city: "",
                barangay: "",
                barangayName: "",
            }));
        }
    }, [data.region]);

    // Fetch Cities when province code changes
    useEffect(() => {
        if (data.province) {
            axios
                .get(`/user/provinces/${data.province}/cities/`)
                .then((res) => setCities(res.data));
        } else {
            setCities([]);
            setDistricts([]);
            setData((prev) => ({
                ...prev,
                cityMunicipalityCode: "",
                city: "",
                barangay: "",
                barangayName: "",
            }));
        }
    }, [data.province]);

    // Fetch Districts (Barangays) when city/municipality code changes
    useEffect(() => {
        if (data.cityMunicipalityCode) {
            axios
                .get(`/user/cities/${data.cityMunicipalityCode}/barangays/`)
                .then((res) => setDistricts(res.data))
                .catch((err) => {
                    console.error("Error fetching barangays:", err);
                    setDistricts([]);
                });
        } else {
            setDistricts([]);
            setData((prev) => ({
                ...prev,
                barangay: "",
                barangayName: "",
            }));
        }
    }, [data.cityMunicipalityCode]);

    // Geocode when all location parts are set (use names, not codes)
    useEffect(() => {
        if (
            data.barangayName &&
            data.city &&
            data.provinceName &&
            data.regionName
        ) {
            const fullAddress = `${data.barangayName}, ${data.city}, ${data.provinceName}, ${data.regionName}, Philippines`;

            axios
                .get("https://nominatim.openstreetmap.org/search", {
                    params: {
                        q: fullAddress,
                        format: "json",
                        limit: 1,
                    },
                })
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        const lat = parseFloat(res.data[0].lat).toFixed(6);
                        const lon = parseFloat(res.data[0].lon).toFixed(6);

                        setData((prev) => ({
                            ...prev,
                            latitude: lat,
                            longitude: lon, // consider renaming to longitude
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Geocoding error:", err);
                });
        }
    }, [
        data.barangayName,
        data.cityMunicipality,
        data.provinceName,
        data.regionName,
    ]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("mycontact.store"), {
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
                Add New Address
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
                                <span className="text-red-500">*</span>Address
                                Type
                            </InputLabel>
                            <SelectInput
                                name="addressType"
                                id="addressType"
                                type="text"
                                value={data.addressType || ""}
                                onChange={(e) =>
                                    setData("addressType", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Address Type</option>
                                <option value="Residential">Residential</option>
                                <option value="Permanent">Permanent</option>
                            </SelectInput>
                            <InputError
                                message={errors.addressType}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Country
                            </InputLabel>
                            <TextInput
                                name="country"
                                id="country"
                                type="text"
                                readOnly
                                value={data.country || ""}
                                onChange={(e) =>
                                    setData("country", e.target.value)
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
                                <span className="text-red-500">*</span>Region
                            </InputLabel>
                            <SelectInput
                                name="region"
                                id="region"
                                value={data.region || ""}
                                onChange={(e) => {
                                    const selected = regions.find(
                                        (r) => r.code === e.target.value
                                    );
                                    setData((prev) => ({
                                        ...prev,
                                        region: selected?.code || "",
                                        regionName: selected?.name || "",
                                        // Reset downstream fields
                                        province: "",
                                        provinceName: "",
                                        cityMunicipalityCode: "",
                                        cityMunicipality: "",
                                        barangay: "",
                                        barangayName: "",
                                    }));
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Region</option>
                                {regions.map((region) => (
                                    <option
                                        key={region.code}
                                        value={region.code}
                                    >
                                        {region.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                message={errors.region}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    {/* row 2 */}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Province
                            </InputLabel>

                            <ComboBox
                                value={data.province}
                                options={provinces}
                                placeholder="Select Province"
                                onChange={(selected) => {
                                    setData((prev) => ({
                                        ...prev,
                                        province: selected?.code || "",
                                        provinceName: selected?.name || "",
                                        // Reset downstream fields
                                        cityMunicipalityCode: "",
                                        cityMunicipality: "",
                                        barangay: "",
                                        barangayName: "",
                                    }));
                                }}
                            />
                            <InputError
                                message={errors.province}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>
                                City/Municipality
                            </InputLabel>
                            <ComboBox
                                value={data.cityMunicipalityCode}
                                options={cities}
                                placeholder="Select Municipality"
                                onChange={(selected) => {
                                    setData((prev) => ({
                                        ...prev,
                                        cityMunicipalityCode:
                                            selected?.code || "",
                                        city: selected?.code || "",
                                        // Reset district
                                        barangay: "",
                                        barangayName: "",
                                    }));
                                }}
                            />
                            <InputError
                                message={errors.city}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Barangay
                            </InputLabel>
                            <ComboBox
                                value={data.barangay}
                                options={districts}
                                placeholder="Select Barangay"
                                onChange={(selected) => {
                                    setData((prev) => ({
                                        ...prev,
                                        barangay: selected.code,
                                        barangayName: selected.name,
                                    }));
                                }}
                            />

                            <InputError
                                message={errors.barangay}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    {/* Row 3*/}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Street
                            </InputLabel>
                            <TextInput
                                name="street"
                                id="street"
                                type="text"
                                value={data.street || ""}
                                onChange={(e) =>
                                    setData("street", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.street}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>House
                                Number
                            </InputLabel>
                            <TextInput
                                name="houseNumber"
                                id="houseNumber"
                                type="text"
                                value={data.houseNumber || ""}
                                onChange={(e) =>
                                    setData("houseNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.houseNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Work
                                Email
                            </InputLabel>
                            <TextInput
                                name="workemail"
                                id="workemail"
                                type="email"
                                value={data.workemail || ""}
                                onChange={(e) =>
                                    setData("workemail", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.workemail}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    {/* Row 4*/}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Other
                                Email
                            </InputLabel>
                            <TextInput
                                name="otheremail"
                                id="otheremail"
                                type="text"
                                value={data.otheremail || ""}
                                onChange={(e) =>
                                    setData("otheremail", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.otheremail}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Work
                                Phone Number
                            </InputLabel>
                            <TextInput
                                name="workphoneNumber"
                                id="workphoneNumber"
                                type="text"
                                value={data.workphoneNumber || ""}
                                onChange={(e) =>
                                    setData("workphoneNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.workphoneNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Home
                                Phone Number
                            </InputLabel>
                            <TextInput
                                name="homephoneNumber"
                                id="homephoneNumber"
                                type="text"
                                value={data.homephoneNumber || ""}
                                onChange={(e) =>
                                    setData("homephoneNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.homephoneNumber}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    {/* Row 4*/}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Mobile
                                Number
                            </InputLabel>
                            <TextInput
                                name="mobileNumber"
                                id="mobileNumber"
                                type="text"
                                value={data.mobileNumber || ""}
                                onChange={(e) =>
                                    setData("mobileNumber", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.mobileNumber}
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
