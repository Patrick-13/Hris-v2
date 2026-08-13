import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FaFileExport } from "react-icons/fa";
import { useRef, useState } from "react";
import { SearchBar } from "@/Components/SearchBar";
import Modal from "@/Components/Modal";
import Show from "../EmployeeDeviceAssignment/Modal/Show";
export default function Index({
    employeedevices,
    employeedeviceedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [showModalDevice, setShowModalDevice] = useState(false);
    const [selectedEmployeeDevice, setSelectedEmployeeDevice] = useState(
        employeedeviceedits || null
    );

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }

            router.get(route("mydevice.index"), updatedQueryParams, {
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

    const handleShowClick = async (deviceId) => {
        try {
            const response = await axios.get(
                `/device-assignment/${deviceId}/show`
            );
            setSelectedEmployeeDevice(response.data); // Set the fetched product data

            setShowModalDevice(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    My Devices
                </h2>
            }
        >
            <Head title="MyDevice" />

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
                                        <FaFileExport size={14} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th>Id</th>
                                                <th>Description</th>
                                                <th>Brand</th>
                                                <th>Serial #</th>
                                                <th>Property #</th>
                                                <th>Date Assigned</th>
                                                <th>Remarks</th>
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
                                                                employeedevice
                                                                    .deviceBy.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice
                                                                        .deviceBy
                                                                        .id
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleShowClick(
                                                                            employeedevice
                                                                                .deviceBy
                                                                                .id
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
                                                                    employeedevice
                                                                        .deviceBy
                                                                        .brand
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice
                                                                        .deviceBy
                                                                        .serial_number
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice
                                                                        .deviceBy
                                                                        .property_number
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice.assigned_at
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeedevice.remarks
                                                                }
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
                    show={showModalDevice}
                    onClose={() => setShowModalDevice(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Show
                        employeedevices={selectedEmployeeDevice}
                        closeModal={() => setShowModalDevice(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
