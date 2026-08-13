import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import { SearchBar } from "@/Components/SearchBar";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import formatPHTime from "@/Utils/formatPHTime";
import isLate from "@/Utils/tardinessChecker";
import DtrButton from "@/Components/DtrButton";
import Modal from "@/Components/Modal";
import Create from "../Activity/Modal/Create";
import { FaPlus } from "react-icons/fa";
export default function Index({
    auth,
    dtrs,
    employees,
    activityypes,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const searchFieldChanged = (field, value) => {
        const updatedQueryParams = { ...queryParams };
        if (value) {
            updatedQueryParams[field] = value; // Use field instead of agencyName
        } else {
            delete updatedQueryParams[field]; // Use field instead of agencyName
        }
        router.replace(route("mydtr.index"), {
            method: "get",
            data: updatedQueryParams,
        });
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const filterByDate = (from = dateFrom, to = dateTo) => {
        const updatedQueryParams = { ...queryParams };

        if (from) updatedQueryParams.date_from = from;
        else delete updatedQueryParams.date_from;

        if (to) updatedQueryParams.date_to = to;
        else delete updatedQueryParams.date_to;

        router.get(route("mydtr.index"), updatedQueryParams, {
            preserveState: true,
            only: [
                "dtrs",
                "queryParams",
                "totalCount",
                "currentPageCount",
                "currentPage",
            ],
        });
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("mydtr.index"), queryParams);
    };
    const today = new Date();
    const dayOfMonth = today.getDate();
    const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();

    const isFwaDay = (employee) => {
        if (!employee) return false;

        // Always show if section_id === 6
        if (employee.in_office === 1) return true;

        // Only FWA-A employees
        if (employee.flexi_type !== "FWA-A") return false;

        // Only Fridays
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday
        return dayOfWeek === 5;
    };

    // const isCutoffDay = dayOfMonth === 24 || dayOfMonth === lastDayOfMonth;

    const employeeId = auth.user.employee_id;

    const downloadDTR = () => {
        if (!dateFrom || !dateTo) {
            alert(
                "Please select both Date From and Date To before downloading."
            );
            return;
        }

        const params = new URLSearchParams({
            employee_id: employeeId,
            date_from: dateFrom,
            date_to: dateTo,
        });

        window.open(`/user/dtr/download?${params.toString()}`, "_blank");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Daily Time Records
                </h2>
            }
        >
            <Head title="Dtr" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Action Panel */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Actions
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Record time punches and search employees
                        </p>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {isFwaDay(employees) ? (
                                    <>
                                        <DtrButton
                                            label="Time In"
                                            type="timeIn"
                                            primary
                                        />
                                        <DtrButton
                                            label="Break Out"
                                            type="breakOut"
                                        />
                                        <DtrButton
                                            label="Break In"
                                            type="breakIn"
                                        />
                                        <DtrButton
                                            label="Time Out"
                                            type="timeOut"
                                        />
                                    </>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        FWA buttons are only available on
                                        Fridays and exclusive for FWA-A only.
                                    </p>
                                )}
                            </div>
                            {/* Search */}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                        {/* Search Input */}
                        <SearchBar
                            queryParams={queryParams}
                            searchFieldChanged={searchFieldChanged}
                        />

                        <div className="flex items-center gap-2">
                            <InputLabel htmlFor="dateFrom" value="From" />
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
                            <InputLabel htmlFor="dateTo" value="To" />
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
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                        >
                            <FaPlus size={14} />
                            <span className="font-medium">Add S.O #</span>
                        </button>
                        <button
                            onClick={downloadDTR}
                            // disabled={!isCutoffDay} // Disable if not 15th or end of month
                            // className={`px-4 py-2 rounded text-white ${isCutoffDay ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}>
                            className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Download DTR (PDF)
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                            <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <TableHeading
                                            name="punch_date"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Date
                                        </TableHeading>
                                        <TableHeading
                                            name="timeIn"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Time In
                                        </TableHeading>
                                        <TableHeading
                                            name="breakOut"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Break Out
                                        </TableHeading>
                                        <TableHeading
                                            name="breakIn"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Break In
                                        </TableHeading>
                                        <TableHeading
                                            name="punch_state"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Time Out
                                        </TableHeading>
                                        <TableHeading
                                            name="tardiness"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Tardiness
                                        </TableHeading>
                                        <TableHeading
                                            name="undertime"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Undertime
                                        </TableHeading>
                                        <TableHeading
                                            name="overtime"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Overtime
                                        </TableHeading>
                                        {/* <th>Total Hours</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dtrs && dtrs.data.length > 0 ? (
                                        dtrs.data.map((dtr) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={dtr.id}
                                            >
                                                <td className="px-3 py-2">
                                                    {new Date(
                                                        dtr.punch_date
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-3 py-2 ${
                                                        isLate(
                                                            dtr.timeIn,
                                                            dtr.flexi_type,
                                                            dtr.punch_date
                                                        )
                                                            ? "text-red-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {formatPHTime(dtr.timeIn)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {formatPHTime(dtr.breakOut)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {formatPHTime(dtr.breakIn)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {formatPHTime(dtr.timeOut)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {dtr.tardiness}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {dtr.undertime}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {dtr.overtime}
                                                </td>
                                                {/* <td className="px-3 py-2">
                                                    {dtr.total_hours}
                                                </td> */}
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
                                links={dtrs && dtrs.meta.links}
                                totalCount={totalCount}
                                currentPageCount={currentPageCount}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        closeable={true}
                        maxWidth="4xl" // ← use this to expand the modal
                    >
                        <Create
                            employeeId={auth.user?.employee_id}
                            activityypes={activityypes}
                            searchFieldChanged={searchFieldChanged}
                            closeModal={() => setShowModal(false)}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
