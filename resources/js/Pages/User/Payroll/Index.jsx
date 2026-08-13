import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import { capitalizeWords } from "@/constant";
import InputLabel from "@/Components/InputLabel";
import { FaPrint } from "react-icons/fa";
export default function Index({
    payrolls,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const filterByDate = (from = dateFrom, to = dateTo) => {
        const updatedQueryParams = { ...queryParams };

        if (from) updatedQueryParams.date_from = from;
        else delete updatedQueryParams.date_from;

        if (to) updatedQueryParams.date_to = to;
        else delete updatedQueryParams.date_to;

        router.get(route("mypayroll.index"), updatedQueryParams, {
            preserveState: true,
            only: [
                "payrolls",
                "queryParams",
                "totalCount",
                "currentPageCount",
                "currentPage",
            ],
        });
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
        router.get(route("mypayroll.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Payroll
                </h2>
            }
        >
            <Head title="Payroll" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="flex items-center gap-4 mb-5">
                                    {/* Search Input */}
                                    <div className="flex items-center gap-2">
                                        <InputLabel
                                            htmlFor="dateFrom"
                                            value="From"
                                        />
                                        <TextInput
                                            id="dateFrom"
                                            value={dateFrom}
                                            type="date"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDateFrom(value);
                                                filterByDate(value, dateTo);
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <InputLabel
                                            htmlFor="dateTo"
                                            value="To"
                                        />
                                        <TextInput
                                            id="dateTo"
                                            value={dateTo}
                                            type="date"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDateTo(value);
                                                filterByDate(dateFrom, value);
                                            }}
                                        />
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
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Fullname
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="payroll_from"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        From
                                                    </TableHeading>

                                                    <TableHeading
                                                        name="payroll_to"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        To
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="montly_rate"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Montly Rate
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="days_worked"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        # of Days
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="days_absent"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        # of Absent
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="premium"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Premium
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="basic_pay"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Gross Pay
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="total_deductions"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Deductions
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="net_pay"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Net Pay
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="status"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Status
                                                    </TableHeading>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payrolls &&
                                                payrolls.data.length > 0 ? (
                                                    payrolls.data.map(
                                                        (payroll) => (
                                                            <tr
                                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                key={payroll.id}
                                                            >
                                                                <td className="px-3 py-2">
                                                                    {`${capitalizeWords(payroll.employeeBy?.lastname)}, 
                                                                    ${capitalizeWords(payroll.employeeBy?.firstname)} 
                                                                          ${
                                                                              payroll
                                                                                  .employeeBy
                                                                                  ?.middlename
                                                                                  ? capitalizeWords(
                                                                                        payroll
                                                                                            .employeeBy
                                                                                            .middlename,
                                                                                    )[0] +
                                                                                    "."
                                                                                  : ""
                                                                          }`}
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {new Date(
                                                                        payroll.payroll_from,
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        },
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {new Date(
                                                                        payroll.payroll_to,
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        },
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.monthly_rate
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.days_worked
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.days_absent
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.premium
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.basic_pay
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.total_deductions
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.net_pay
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-white text-sm font-medium
            ${
                payroll.status === "draft"
                    ? "bg-orange-500"
                    : payroll.status === "approved"
                      ? "bg-green-500"
                      : "bg-gray-400"
            }`}
                                                                    >
                                                                        {
                                                                            payroll.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                `/user/export-pdf-payroll/${payroll.id}`,
                                                                                "_blank",
                                                                            )
                                                                        }
                                                                        className="font-medium text-blue-500 hover:underline mx-1"
                                                                    >
                                                                        <FaPrint
                                                                            className="text-red-500"
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
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
                                        <Pagination
                                            links={
                                                payrolls && payrolls.meta.links
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
            </div>
        </AuthenticatedLayout>
    );
}
