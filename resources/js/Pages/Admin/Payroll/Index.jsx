import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPencilAlt, FaDownload } from "react-icons/fa";
import { useRef, useState } from "react";
import { capitalizeWords } from "@/constant";
import InputLabel from "@/Components/InputLabel";
import { ComboBox } from "@/Components/ComboBox";
import SelectInput from "@/Components/SelectInput";
import { SearchBar } from "@/Components/SearchBar";
import { toast } from "react-toastify";
export default function Index({
    employees,
    payrolls,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(payrolls);
    queryParams = queryParams || {};
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    // const [empId, setEmpId] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingGeneratingPayroll, setLoadingGeneratingPayroll] =
        useState(false);
    const [status, setStatus] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const debounceTimeout = useRef(null);

    const filterByDate = (from = dateFrom, to = dateTo) => {
        const updatedQueryParams = { ...queryParams };

        if (from) updatedQueryParams.date_from = from;
        else delete updatedQueryParams.date_from;

        if (to) updatedQueryParams.date_to = to;
        else delete updatedQueryParams.date_to;

        router.get(route("payroll.index"), updatedQueryParams, {
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

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("payroll.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "payrolls",
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
        router.get(route("payroll.index"), queryParams);
    };

    const employeeOptions = (employees || []).map((emp) => ({
        code: emp.employee_id,
        name: `${emp.lastname}, ${emp.firstname}`,
    }));

    const handleBulkUpdateStatus = () => {
        if (
            !window.confirm(`Update ${selectedIds.length} status request(s)?`)
        ) {
            return;
        }

        router.post(
            route("payroll.bulk-approve"),
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            },
        );
    };

    const handleDownloadPayroll = async () => {
        if (!dateFrom || !dateTo) {
            alert("Please select both From and To dates.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get("/admin/export-payroll", {
                responseType: "blob",
                params: {
                    status: status,
                    date_from: dateFrom,
                    date_to: dateTo,
                },
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Regular_fund.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Download failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const generatePayroll = () => {
        router.post(
            "/admin/payroll/generate",
            {
                // employee_id: queryParams.search || "",
                date_from: dateFrom,
                date_to: dateTo,
                status: queryParams.status || "",
            },
            {
                preserveScroll: true,

                onStart: () => {
                    setLoadingGeneratingPayroll(true);
                },

                onFinish: () => {
                    setLoadingGeneratingPayroll(false);
                },

                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError);
                },
            },
        );
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("payroll.index"), newParams);
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
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />
                                    {/* <div className="relative flex items-center w-[350px]">
                                        <ComboBox
                                            value={empId || ""}
                                            options={employeeOptions}
                                            placeholder="Select Employee"
                                            className="w-full pl-4 pr-10"
                                            onChange={(selected) => {
                                                setEmpId(selected?.code || "");
                                                setData(
                                                    "employee_id",
                                                    selected?.code || "",
                                                );
                                            }}
                                        />
                                    </div> */}
                                    <div className="flex items-center gap-2">
                                        <SelectInput
                                            id="status"
                                            value={queryParams.status || ""}
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Employment Status
                                            </option>
                                            <option value="Regular">
                                                Regular
                                            </option>
                                            <option value="Contractual">
                                                Contractual
                                            </option>
                                        </SelectInput>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <SelectInput
                                            id="payroll_status"
                                            value={
                                                queryParams.payroll_status || ""
                                            }
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "payroll_status",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">Status</option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="draft">Draft</option>
                                        </SelectInput>
                                    </div>
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
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={handleBulkUpdateStatus}
                                            className="flex items-center gap-2 py-2 px-4 rounded-lg shadow-sm transition-all bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Bulk Update Status (
                                            {selectedIds.length})
                                        </button>
                                        <button
                                            onClick={generatePayroll}
                                            disabled={loadingGeneratingPayroll}
                                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-all"
                                        >
                                            {loadingGeneratingPayroll
                                                ? "Generating..."
                                                : "Generate Payroll"}
                                        </button>

                                        <button
                                            onClick={handleDownloadPayroll}
                                            disabled={loading}
                                            className="flex items-center gap-2 py-2 px-4 rounded-lg shadow-sm transition-all bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            {loading
                                                ? "Preparing..."
                                                : "Download Payroll"}
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <div className="flex items-center gap-2 mb-2">
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
                                            {[20, 50, 100, 150].map(
                                                (perPage) => (
                                                    <option
                                                        key={perPage}
                                                        value={perPage}
                                                    >
                                                        {perPage} Rows
                                                    </option>
                                                ),
                                            )}
                                        </SelectInput>
                                    </div>
                                    <div className="md:h-[600px] lg:h-[700px] overflow-y-auto">
                                        <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="text-nowrap">
                                                    <th className="px-3 py-2">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) =>
                                                                setSelectedIds(
                                                                    e.target
                                                                        .checked
                                                                        ? payrolls.data.map(
                                                                              (
                                                                                  o,
                                                                              ) =>
                                                                                  o.id,
                                                                          )
                                                                        : [],
                                                                )
                                                            }
                                                            checked={
                                                                payrolls?.data
                                                                    .length >
                                                                    0 &&
                                                                selectedIds.length ===
                                                                    payrolls
                                                                        .data
                                                                        .length
                                                            }
                                                        />
                                                    </th>
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
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedIds.includes(
                                                                            payroll.id,
                                                                        )}
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            if (
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            ) {
                                                                                setSelectedIds(
                                                                                    [
                                                                                        ...selectedIds,
                                                                                        payroll.id,
                                                                                    ],
                                                                                );
                                                                            } else {
                                                                                setSelectedIds(
                                                                                    selectedIds.filter(
                                                                                        (
                                                                                            id,
                                                                                        ) =>
                                                                                            id !==
                                                                                            payroll.id,
                                                                                    ),
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>
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
                                                                    {
                                                                        payroll.payroll_from
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        payroll.payroll_to
                                                                    }
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
                                        links={payrolls && payrolls.meta.links}
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
            {loadingGeneratingPayroll && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>

                        <p className="mt-3 text-gray-700 font-medium">
                            Generating payroll...
                        </p>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>

                        <p className="mt-3 font-medium text-gray-700">
                            Preparing payroll file...
                        </p>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
