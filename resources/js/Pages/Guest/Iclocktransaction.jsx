import Pagination from "@/Components/Pagination";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import { useEffect, useRef } from "react";
import { SearchBar } from "@/Components/SearchBar";
import IclockLayout from "@/Layouts/IclockLayout";

export default function Iclocktransaction({
    auth,
    transactions,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(transactions);
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
            router.get(
                route("iclocktransactionguest.index"),
                updatedQueryParams,
                {
                    preserveState: true,
                    only: [
                        "transactions",
                        "queryParams",
                        "totalCount",
                        "currentPageCount",
                        "currentPage",
                    ],
                },
            );
        }, 300); // Wait 1000ms after user stops typing
    };

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: [
                    "transactions",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
                preserveState: true,
            });
        }, 3000); // every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const sortChanged = (employee_name) => {
        if (employee_name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = employee_name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("iclocktransactionguest.index"), queryParams);
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("iclocktransactionguest.index"), newParams);
    };

    return (
        <IclockLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Iclock Transaction
                    </h2>
                </div>
            }
        >
            <Head title="Transaction" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg darkMode ? 'dark' : ''">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                                {/* Left side: Search */}
                                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />
                                </div>

                                {/* Right side: Show Rows */}
                                <div className="flex items-center gap-2">
                                    <InputLabel
                                        htmlFor="show"
                                        value="Show"
                                        className="text-lg"
                                    />
                                    <SelectInput
                                        id="show"
                                        value={queryParams.per_page}
                                        onChange={handleRowsPerPageChange}
                                        className="w-32"
                                    >
                                        {[50, 100, 150, 200].map((perPage) => (
                                            <option
                                                key={perPage}
                                                value={perPage}
                                            >
                                                {perPage} Rows
                                            </option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="md:h-[80px] lg:h-[800px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <TableHeading
                                                    name="emp_code"
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
                                                    name="punch_time"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date
                                                </TableHeading>
                                                <TableHeading
                                                    name="punch_time"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Time
                                                </TableHeading>
                                                <TableHeading
                                                    name="punch_state"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Punch State
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions &&
                                            transactions.data.length > 0 ? (
                                                transactions.data.map(
                                                    (transaction) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={transaction.id}
                                                        >
                                                            <td className="px-3 py-2">
                                                                {transaction.employee_transaction &&
                                                                transaction.employee_transaction ? (
                                                                    `${
                                                                        transaction
                                                                            .employee_transaction
                                                                            .employee_id ||
                                                                        ""
                                                                    }`
                                                                ) : (
                                                                    <span className="text-red-500">
                                                                        NOT IN
                                                                        THE
                                                                        EMPLOYEELIST
                                                                        Data
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {transaction.employee_transaction &&
                                                                transaction.employee_transaction ? (
                                                                    `${
                                                                        transaction
                                                                            .employee_transaction
                                                                            .last_name ||
                                                                        ""
                                                                    }, ${
                                                                        transaction
                                                                            .employee_transaction
                                                                            .first_name ||
                                                                        ""
                                                                    }`
                                                                ) : (
                                                                    <span className="text-red-500">
                                                                        NOT IN
                                                                        THE
                                                                        EMPLOYEELIST
                                                                        Data
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    transaction.punch_time,
                                                                ).toLocaleDateString()}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    transaction.punch_time,
                                                                ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    },
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {transaction.punch_state ==
                                                                0
                                                                    ? "Check In"
                                                                    : transaction.punch_state ==
                                                                        1
                                                                      ? "Check Out"
                                                                      : transaction.punch_state ==
                                                                          4
                                                                        ? "Overtime Check In"
                                                                        : transaction.punch_state ==
                                                                            5
                                                                          ? "Overtime Check Out"
                                                                          : "Unknown State"}
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
                                    links={transactions.meta.links}
                                    totalCount={totalCount}
                                    currentPageCount={currentPageCount}
                                    currentPage={currentPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IclockLayout>
    );
}
