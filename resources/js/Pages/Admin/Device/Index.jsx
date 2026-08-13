import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt, FaDownload } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import { DEVICE_STATUS_CLASS_MAP, DEVICE_STATUS_TEXT_MAP } from "@/constant";
export default function Index({
    categories,
    devices,
    deviceedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(deviceedits || null);

    const handleEditClick = async (deviceId) => {
        try {
            const response = await axios.get(`/admin/device/${deviceId}/edit`);
            setSelectedDevice(response.data); // Set the fetched product data
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("device.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "devices",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (div_name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (div_name) => {
        if (div_name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = div_name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("device.index"), queryParams);
    };

    const deleteDevice = (device) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${device.description} device?`
            )
        ) {
            return;
        }
        router.delete(route("device.destroy", device.id));
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/export-inventory", {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Inventory.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Device
                </h2>
            }
        >
            <Head title="Device" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="flex items-center gap-4 mb-5">
                                    {/* Search Input */}
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />
                                    {/* Add Button */}
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <FaPlus size={14} />
                                        <span>Add New Device</span>
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 bg-red-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all"
                                    >
                                        <FaDownload size={14} />
                                        <span>Download Devices</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                           
                                                <TableHeading
                                                    name="fundType"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Fund Type
                                                </TableHeading>
                                                <TableHeading
                                                    name="ppeType"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    PPE Type
                                                </TableHeading>
                                                <TableHeading
                                                    name="parNo"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    PAR #
                                                </TableHeading>
                                                <TableHeading
                                                    name="category "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Articles
                                                </TableHeading>
                                                <TableHeading
                                                    name="description"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Description Articles
                                                </TableHeading>

                                                <TableHeading
                                                    name="property_number "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Property #
                                                </TableHeading>
                                                <TableHeading
                                                    name="unitofMeasure "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Unit of Measure
                                                </TableHeading>
                                                <TableHeading
                                                    name="price "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Unit Value
                                                </TableHeading>
                                                <TableHeading
                                                    name="quantity_property_card"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Qty. Property Card
                                                </TableHeading>
                                                <TableHeading
                                                    name="quantity_physical_count"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Qty. Physical Count
                                                </TableHeading>
                                        
                                                <TableHeading
                                                    name="status "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Status
                                                </TableHeading>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {devices &&
                                            devices.data.length > 0 ? (
                                                devices.data.map((device) => (
                                                    <tr
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                        key={device.id}
                                                    >
                                                 
                                                        <td className="px-3 py-2">
                                                            {device.fundType}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.ppeType}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.parNo}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                device
                                                                    .categoryBy
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.description +
                                                                "- SN: " +
                                                                device.serial_number}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                device.property_number
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                device.unitofMeasure
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.price}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.quantity_property_card}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {device.quantity_physical_count}
                                                        </td>
                                                       
                                                        <td className="px-3 py-2">
                                                            <span
                                                                className={
                                                                    "px-1 py-1 rounded text-white " +
                                                                    DEVICE_STATUS_CLASS_MAP[
                                                                        device
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    DEVICE_STATUS_TEXT_MAP[
                                                                        device
                                                                            .status
                                                                    ]
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-3 py-2 flex text-nowrap">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        device.id
                                                                    )
                                                                }
                                                                className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                            >
                                                                <FaPencilAlt
                                                                    className="text-green-500"
                                                                    size={18}
                                                                />
                                                            </button>

                                                            <button
                                                                onClick={(e) =>
                                                                    deleteDevice(
                                                                        device
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                <FaTrashAlt
                                                                    className="text-red-600"
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="11"
                                                        className="text-center py-4"
                                                    >
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        links={devices && devices.meta.links}
                                        totalCount={totalCount}
                                        currentPageCount={currentPageCount}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Create
                        categories={categories}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Edit
                        categories={categories}
                        devices={selectedDevice}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
