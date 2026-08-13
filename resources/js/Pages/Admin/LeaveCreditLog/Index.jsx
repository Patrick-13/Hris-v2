import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useRef, useState } from "react";
import { SearchBar } from "@/Components/SearchBar";
import { FaDownload } from "react-icons/fa";
export default function Index({
    auth,
    leavecreditlogs,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [loading, setLoading] = useState(false);
    const [shown, setShown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const employeeId = leavecreditlogs.data[0]?.employee_id;

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }

            router.get(route("leavecreditlog.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "leavecreditlogs",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (buttonName, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(buttonName, e.target.value);
    };

    const sortChanged = (buttonName) => {
        if (buttonName === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = buttonName;
            queryParams.sort_direction = "asc";
        }
        router.get(route("leavecreditlog.index"), queryParams);
    };

    const handleDownloadLeaveCard = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/admin/export-leavecard", {
                params: {
                    search: employeeId, // or whatever variable contains the employee id
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.download = "Leave_Card.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-500 dark:text-gray-700 leading-tight flex items-center gap-2">
                        <Link
                            href="/"
                            className="hover:text-blue-500 transition"
                        ></Link>
                        <span>Leave Credit Logs</span>
                    </h2>
                </div>
            }
        >
            <Head title="Leave Credit Logs" />
            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="flex items-center gap-4 mb-5">
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />

                                    <button
                                        className="flex items-center gap-2 bg-orange-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-all"
                                        onClick={handleDownloadLeaveCard}
                                        disabled={loading}
                                    >
                                        <FaDownload size={16} />
                                        Download Leave Card
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[650px] lg:h-[650px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <TableHeading
                                                    name="employee_name"
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
                                                    name="month"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Month
                                                </TableHeading>

                                                <TableHeading
                                                    name="leave_type_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Leave Type
                                                </TableHeading>
                                                <TableHeading
                                                    name="earned"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Earned
                                                </TableHeading>

                                                <TableHeading
                                                    name="late_equivalent_days"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Absence/Tardiness/Undertime
                                                </TableHeading>
                                                <TableHeading
                                                    name="before_balance"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Before Balance
                                                </TableHeading>
                                                <TableHeading
                                                    name="after_balance"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    New Balance
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leavecreditlogs &&
                                            leavecreditlogs.data.length > 0 ? (
                                                leavecreditlogs.data.map(
                                                    (leavecreditlog) => (
                                                        <tr
                                                            className="bg-white border-b text-left dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                leavecreditlog.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    leavecreditlog.employee_name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    leavecreditlog.year,
                                                                    leavecreditlog.month -
                                                                        1,
                                                                ).toLocaleString(
                                                                    "default",
                                                                    {
                                                                        month: "long",
                                                                    },
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    leavecreditlog
                                                                        .leaveType
                                                                        ?.name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecreditlog.earned
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecreditlog.leave_type_id,
                                                                      )
                                                                        ? `${(Number(leavecreditlog.earned) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecreditlog.earned).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {leavecreditlog.late_equivalent_days
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecreditlog.leave_type_id,
                                                                      )
                                                                        ? `${(Number(leavecreditlog.late_equivalent_days) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecreditlog.late_equivalent_days).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecreditlog.before_balance
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecreditlog.leave_type_id,
                                                                      )
                                                                        ? `${(Number(leavecreditlog.before_balance) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecreditlog.before_balance).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecreditlog.after_balance
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecreditlog.leave_type_id,
                                                                      )
                                                                        ? `${(Number(leavecreditlog.after_balance) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecreditlog.after_balance).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    ),
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
                                </div>
                                <Pagination
                                    links={
                                        leavecreditlogs &&
                                        leavecreditlogs.meta.links
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
        </AuthenticatedLayout>
    );
}
