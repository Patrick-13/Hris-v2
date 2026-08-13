import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import { SearchBar } from "@/Components/SearchBar";
import ShowAccomplishment from "./Modal/ShowAccomplishment";

export default function Index({
    personnelaccomplishments,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [showModalAccomplishment, setShowModalAccomplishment] =
        useState(false);
    const [selectedAccomplishmentOvertime, setSelectedAccomplishmentOvertime] =
        useState(null);

    const handleAccomplishmentClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/admin/aro/${personnelovertimeId}/showaccomplishment`
            );
            console.log(response.data);
            setSelectedAccomplishmentOvertime(response.data);
            setShowModalAccomplishment(true);
        } catch (error) {
            console.error("Error fetching data", error);
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
            router.get(route("aro.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "personnelaccomplishments",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const formatName = (emp) => {
        if (!emp) return "-";

        const mi = emp.middlename ? emp.middlename[0].toUpperCase() + "." : "";

        return `${emp.lastname}, ${emp.firstname} ${mi}`;
    };

    const sortChanged = (employee_id) => {
        if (employee_id === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = employee_id;
            queryParams.sort_direction = "asc";
        }
        router.get(route("aro.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    ARO Admin View
                </h2>
            }
        >
            <Head title="Employee Overtime" />

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
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th>Employee Name</th>

                                                <TableHeading
                                                    name="overtime_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    OT Accomplishment Report
                                                </TableHeading>

                                                <TableHeading
                                                    name="request_status"
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {personnelaccomplishments &&
                                            personnelaccomplishments.data
                                                .length > 0 ? (
                                                personnelaccomplishments.data.map(
                                                    (
                                                        personnelaccomplishment
                                                    ) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                personnelaccomplishment.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {formatName(
                                                                    personnelaccomplishment
                                                                        .overtime
                                                                        ?.employeeBy
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleAccomplishmentClick(
                                                                            personnelaccomplishment
                                                                                .overtime
                                                                                .id
                                                                        )
                                                                    }
                                                                    className="flex items-center justify-center text-blue-600 hover:underline"
                                                                >
                                                                    <span>
                                                                        View
                                                                        Report
                                                                    </span>
                                                                </button>
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {personnelaccomplishment.approvals?.map(
                                                                    (
                                                                        approval
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                approval.id
                                                                            }
                                                                            className="flex gap-2"
                                                                        >
                                                                            <span className="font-medium">
                                                                                {
                                                                                    approval.level
                                                                                }

                                                                                :
                                                                            </span>
                                                                            <span
                                                                                className={`font-semibold ${
                                                                                    approval.status ===
                                                                                    "approved"
                                                                                        ? "text-green-600"
                                                                                        : approval.status ===
                                                                                          "pending"
                                                                                        ? "text-orange-600"
                                                                                        : approval.status ===
                                                                                          "returned"
                                                                                        ? "text-amber-600"
                                                                                        : approval.status ===
                                                                                          "rejected"
                                                                                        ? "text-red-600"
                                                                                        : approval.status ===
                                                                                          "waiting"
                                                                                        ? "text-blue-600"
                                                                                        : "text-gray-600"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    approval.status
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
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
                                            personnelaccomplishments &&
                                            personnelaccomplishments.meta.links
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
                    show={showModalAccomplishment}
                    onClose={() => setShowModalAccomplishment(false)}
                    closeable={true}
                    maxWidth="4xl"
                >
                    <ShowAccomplishment
                        employeeovertimes={selectedAccomplishmentOvertime}
                        closeModal={() => setShowModalAccomplishment(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
