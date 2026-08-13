import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useRef } from "react";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    personnelovertimes,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("employeeovertime.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "personnelovertimes",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
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
        router.get(route("employeeovertime.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Authority to Render Overtime
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
                                                    Employee Id
                                                </TableHeading>
                                                <TableHeading
                                                    name="lastname"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Employee Name
                                                </TableHeading>

                                                <TableHeading
                                                    name="date_of_request"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date of Request
                                                </TableHeading>
                                                <TableHeading
                                                    name="purpose_of_overtime"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Purpose
                                                </TableHeading>
                                                <TableHeading
                                                    name="justification"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Justification
                                                </TableHeading>
                                                <TableHeading
                                                    name="work_to_accomplished"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Work to Accomplished
                                                </TableHeading>
                                                <TableHeading
                                                    name="duration_hours"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    # of Hours
                                                </TableHeading>
                                                <TableHeading
                                                    name="date_of_overtime"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date of Overtime
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
                                            {personnelovertimes &&
                                            personnelovertimes.data.length >
                                                0 ? (
                                                personnelovertimes.data.map(
                                                    (personnelovertime) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                personnelovertime.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime
                                                                        .employeeBy
                                                                        .employee_id
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {personnelovertime.employeeBy
                                                                    ? personnelovertime
                                                                          .employeeBy
                                                                          .lastname +
                                                                      ", " +
                                                                      personnelovertime
                                                                          .employeeBy
                                                                          .firstname +
                                                                      " " +
                                                                      personnelovertime.employeeBy.middlename.charAt(
                                                                          0
                                                                      ) +
                                                                      "."
                                                                    : ""}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {personnelovertime.date_of_request
                                                                    ? new Date(
                                                                          personnelovertime.date_of_request
                                                                      ).toLocaleDateString(
                                                                          "en-US",
                                                                          {
                                                                              month: "2-digit",
                                                                              day: "2-digit",
                                                                              year: "numeric",
                                                                          }
                                                                      )
                                                                    : ""}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime.purpose_of_overtime
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime.justification
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime.work_to_accomplished
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime.duration_hours
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {personnelovertime.date_of_overtime
                                                                    ? new Date(
                                                                          personnelovertime.date_of_overtime
                                                                      ).toLocaleDateString(
                                                                          "en-US",
                                                                          {
                                                                              month: "2-digit",
                                                                              day: "2-digit",
                                                                              year: "numeric",
                                                                          }
                                                                      )
                                                                    : ""}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {personnelovertime.approvals?.map(
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
                                                                            <span>
                                                                                {" "}
                                                                                {
                                                                                    approval.approved_at
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
                                            personnelovertimes &&
                                            personnelovertimes.meta.links
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
            </div>
        </AuthenticatedLayout>
    );
}
