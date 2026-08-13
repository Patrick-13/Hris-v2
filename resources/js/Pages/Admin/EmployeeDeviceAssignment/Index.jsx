import Pagination from "@/Components/Pagination";
import DownloadableQRCode from "@/Components/DownloadableQRCode";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { CiFilter } from "react-icons/ci";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import Show from "./Modal/Show";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    categories,
    employees,
    devices,
    employeedevices,
    employeedeviceedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const debounceTimeout = useRef(null);
    const qrRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalDevice, setShowModalDevice] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedEmployeeDevice, setSelectedEmployeeDevice] = useState(
        employeedeviceedits || null
    );

    const handleEditClick = async (employeedeviceId) => {
        try {
            const response = await axios.get(
                `/device-assignment/${employeedeviceId}/edit`
            );
            setSelectedEmployeeDevice(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleShowClick = async (deviceId) => {
        try {
            const response = await axios.get(
                `/device-assignment/${deviceId}/show`
            );
            setSelectedEmployeeDevice(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalDevice(true); // Open the modal
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

            console.log("Updated Query Params:", updatedQueryParams);
            router.get(route("device-assignment.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "employeedevices",
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
        router.get(route("device-assignment.index"), queryParams);
    };

    const deleteEmployeeDevice = (employeedevice) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${employeedevice.employee_id} Employee Device?`
            )
        ) {
            return;
        }
        router.delete(route("device-assignment.destroy", employeedevice.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Employee Device
                </h2>
            }
        >
            <Head title="Employee Device" />

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
                                        <span>
                                            Assign New Device to Employee
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <TableHeading
                                                    name="employee_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Accountable Officer
                                                </TableHeading>
                                                <TableHeading
                                                    name="device_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Description Article
                                                </TableHeading>
                                                <TableHeading
                                                    name="assigned_at "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date Acquired
                                                </TableHeading>
                                                <TableHeading
                                                    name="returned_at"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date Returned
                                                </TableHeading>
                                                <TableHeading
                                                    name="remarks "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Remarks
                                                </TableHeading>
                                                <th className="px-3 py-2">
                                                    DL QR Code
                                                </th>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeedevices &&
                                            employeedevices.data.length > 0 ? (
                                                employeedevices.data.map(
                                                    (employeedevice) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                employeedevice.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {employeedevice
                                                                    .employeeBy
                                                                    .lastname +
                                                                    ", " +
                                                                    employeedevice
                                                                        .employeeBy
                                                                        .firstname}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleShowClick(
                                                                            employeedevice.id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="font-medium text-blue-500 hover:text-blue-700 hover:underline mx-1">
                                                                        {
                                                                            employeedevice
                                                                                .deviceBy
                                                                                .description
                                                                        }
                                                                    </span>
                                                                </button>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice.assigned_at
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employeedevice.returned_at ? (
                                                                    employeedevice.returned_at
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                                                                        Currently
                                                                        Assigned
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employeedevice.remarks +
                                                                    " C/O: " +
                                                                    employeedevice
                                                                        .employeecareOfBy
                                                                        .lastname +
                                                                    ", " +
                                                                    employeedevice
                                                                        .employeecareOfBy
                                                                        .firstname}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <DownloadableQRCode
                                                                    value={`Fullname: ${employeedevice.employeeBy.lastname}, ${employeedevice.employeeBy.firstname}
                                                                        \n Description: ${employeedevice.deviceBy.description}
                                                                        \n Serial Number: ${employeedevice.deviceBy.serial_number}
                                                                        \n Property Number: ${employeedevice.deviceBy.property_number}
                                                                        \n Price: ${employeedevice.deviceBy.price}`}
                                                                    filename={`${employeedevice.employeeBy.lastname}_${employeedevice.deviceBy.description}_QR.png`}
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            employeedevice.id
                                                                        )
                                                                    }
                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                >
                                                                    <FaPencilAlt
                                                                        className="text-green-500"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        deleteEmployeeDevice(
                                                                            employeedevice
                                                                        )
                                                                    }
                                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                                >
                                                                    <FaTrashAlt
                                                                        className="text-red-600"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
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
                                        links={
                                            employeedevices &&
                                            employeedevices.meta.links
                                        }
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
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Create
                        employees={employees}
                        devices={devices}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Edit
                        employees={employees}
                        devices={devices}
                        employeedevices={selectedEmployeeDevice}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>

                <Modal
                    show={showModalDevice}
                    onClose={() => setShowModalDevice(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Show
                        employees={employees}
                        devices={devices}
                        categories={categories}
                        employeedevices={selectedEmployeeDevice}
                        closeModal={() => setShowModalDevice(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
