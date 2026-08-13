import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaEye, FaPencilAlt, FaRegFilePdf } from "react-icons/fa";
import { useRef, useState } from "react";
import { SearchBar } from "@/Components/SearchBar";
import Spinner from "@/Components/Spinner";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { capitalizeWords } from "@/constant";
import formatPHTime from "@/Utils/formatPHTime";
import isLate from "@/Utils/tardinessChecker";
import Modal from "@/Components/Modal";
import Edit from "./Modal/Edit";
import Show from "./Modal/Show";
export default function Index({
    dtrs,
    dtredits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(dtrs);
    queryParams = queryParams || {};
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const debounceTimeout = useRef(null);
    const [loadingexport, setLoadingexport] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedDtr, setSelectedDtr] = useState(dtredits || null);
    const [showCoordiante, setShowModalCoordinate] = useState(false);
    const [showProgresseemailModal, setShowProgressexportEmailModal] =
        useState(false);

    const handleEditClick = async (dtrId) => {
        try {
            const response = await axios.get(`/admin/dtr/${dtrId}/edit`);
            setSelectedDtr(response.data); // Set the fetched product data

            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleShowCoordinate = async (dtrId) => {
        try {
            const response = await axios.get(`/admin/dtr/${dtrId}/show`);
            setSelectedDtr(response.data); // Set the fetched product data

            setShowModalCoordinate(true); // Open the modal
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
            router.get(route("dtr.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "dtrs",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const filterByDate = (from = dateFrom, to = dateTo) => {
        const updatedQueryParams = { ...queryParams };

        if (from) updatedQueryParams.date_from = from;
        else delete updatedQueryParams.date_from;

        if (to) updatedQueryParams.date_to = to;
        else delete updatedQueryParams.date_to;

        router.get(route("dtr.index"), updatedQueryParams, {
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
        router.get(route("dtr.index"), queryParams);
    };

    const handleExportEmailPdf = async () => {
        if (!dateFrom || !dateTo) {
            alert("Please select a date range.");
            return;
        }

        setLoadingexport(true);
        setShowProgressexportEmailModal(true);

        try {
            const response = await axios.post(`/admin/dtr/send-email`, {
                date_from: dateFrom,
                date_to: dateTo,
                search: queryParams.search || "",
            });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert("Error sending DTR emails.");
        } finally {
            setLoadingexport(false);
            setShowProgressexportEmailModal(false);
        }
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("dtr.index"), newParams);
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

                                    <button
                                        className="flex items-center gap-2 bg-orange-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-all"
                                        onClick={handleExportEmailPdf}
                                        disabled={loadingexport}
                                    >
                                        <FaRegFilePdf size={16} />
                                        Send Email
                                    </button>
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
                                            {[10, 20, 50, 100].map(
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
                                    <div className="md:h-[800px] lg:h-[800px] overflow-y-auto">
                                        <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="text-nowrap">
                                                    <TableHeading
                                                        name="employee_Id"
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
                                                        Employee Id
                                                    </TableHeading>
                                                    <th>Full Name</th>
                                                    <TableHeading
                                                        name="punch_date"
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
                                                        Date
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="flexi_type"
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
                                                        Type
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="timeIn"
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
                                                        Time In
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="breakOut"
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
                                                        Break Out
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="breakIn"
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
                                                        Break In
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="timeOut"
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
                                                        Time Out
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="tardiness"
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
                                                        Tardiness
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="undertime"
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
                                                        Undertime
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="overtime"
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
                                                        Overtime
                                                    </TableHeading>
                                                    {/* <th>Total Hours</th> */}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dtrs &&
                                                dtrs.data.length > 0 ? (
                                                    dtrs.data.map((dtr) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={dtr.id}
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    dtr.employee_id
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {`${capitalizeWords(dtr.employeeTransaction?.lastname)}, 
                                                                    ${capitalizeWords(dtr.employeeTransaction?.firstname)} 
                                                                    ${
                                                                        dtr
                                                                            .employeeTransaction
                                                                            ?.middlename
                                                                            ? capitalizeWords(
                                                                                  dtr
                                                                                      .employeeTransaction
                                                                                      .middlename,
                                                                              )[0] +
                                                                              "."
                                                                            : ""
                                                                    }`}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    dtr.punch_date,
                                                                ).toLocaleDateString(
                                                                    "en-GB",
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {dtr.flexi_type}
                                                            </td>
                                                            <td
                                                                className={`px-3 py-2 ${isLate(dtr.timeIn, dtr.flexi_type) ? "text-red-600" : ""}`}
                                                            >
                                                                {formatPHTime(
                                                                    dtr.timeIn,
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {formatPHTime(
                                                                    dtr.breakOut,
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {formatPHTime(
                                                                    dtr.breakIn,
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {formatPHTime(
                                                                    dtr.timeOut,
                                                                )}
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

                                                            <td className="px-3 py-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            dtr.id,
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
                                                                    onClick={() =>
                                                                        handleShowCoordinate(
                                                                            dtr.id,
                                                                        )
                                                                    }
                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                >
                                                                    <FaEye
                                                                        className="text-blue-500"
                                                                        size={
                                                                            18
                                                                        }
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
                                            links={dtrs && dtrs.meta.links}
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
                        show={showModalEdit}
                        onClose={() => setShowModalEdit(false)}
                        closeable={true}
                        maxWidth="2xl" // ← use this to expand the modal
                    >
                        <Edit
                            dtrs={selectedDtr}
                            closeModal={() => setShowModalEdit(false)}
                        />
                    </Modal>

                    <Modal
                        show={showCoordiante}
                        onClose={() => setShowModalCoordinate(false)}
                        closeable={true}
                        maxWidth="2xl" // ← use this to expand the modal
                    >
                        <Show
                            dtr={selectedDtr}
                            closeModal={() => setShowModalCoordinate(false)}
                        />
                    </Modal>
                </div>
            </div>
            <Spinner showProgresseemailModal={showProgresseemailModal} />
        </AuthenticatedLayout>
    );
}
