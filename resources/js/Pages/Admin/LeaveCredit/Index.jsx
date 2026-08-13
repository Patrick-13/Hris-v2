import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { CiFilter, CiImport } from "react-icons/ci";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import Import from "./Modal/Import";
export default function Index({
    auth,
    employees,
    leavetypes,
    leavecredits,
    leavecreditedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(leavecredits);
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [selectedLeaveCredit, setSelectedLeaveCredit] = useState(
        leavecreditedits || null,
    );

    const handleEditClick = async (leavecreditId) => {
        try {
            const response = await axios.get(
                `/admin/leavecredit/${leavecreditId}/edit`,
            );
            setSelectedLeaveCredit(response.data); // Set the fetched product data
            setShowModalEdit(true); // Open the modal
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
            router.get(route("leavecredit.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "leavecredits",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (employee_id, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(employee_id, e.target.value);
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
        router.get(route("leavecredit.index"), queryParams);
    };

    const deleteLeaveCredit = (leavecredit) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${leavecredit.employee_id} Leave Credit?`,
            )
        ) {
            return;
        }
        router.delete(route("leavecredit.destroy", leavecredit.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Credits
                </h2>
            }
        >
            <Head title="Leave Credit" />

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
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <FaPlus size={14} />
                                        <span>New</span>
                                    </button>
                                    <button
                                        onClick={() => setShowModalImport(true)}
                                        className="flex items-center gap-2 bg-red-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all"
                                    >
                                        <CiImport size={18} />{" "}
                                        <span>Import</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                {/* <TableHeading
                                                    name="id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    ID
                                                </TableHeading> */}
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
                                                    Employee Name
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
                                                    name="year"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Year
                                                </TableHeading>
                                                <TableHeading
                                                    name="entitled"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Entitled
                                                </TableHeading>
                                                <TableHeading
                                                    name="used"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Used
                                                </TableHeading>
                                                <TableHeading
                                                    name="balance"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Balance
                                                </TableHeading>
                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leavecredits &&
                                            leavecredits.data.length > 0 ? (
                                                leavecredits.data.map(
                                                    (leavecredit) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={leavecredit.id}
                                                        >
                                                            {/* <td className="px-3 py-2">
                                                                {leavecredit.id}
                                                            </td> */}
                                                            <td className="px-3 py-2">
                                                                {leavecredit
                                                                    .employeeBy
                                                                    .lastname +
                                                                    ", " +
                                                                    leavecredit
                                                                        .employeeBy
                                                                        .firstname +
                                                                    " " +
                                                                    leavecredit
                                                                        .employeeBy
                                                                        .middlename}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    leavecredit
                                                                        .leaveTypeBy
                                                                        ?.name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    leavecredit.year
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecredit.entitled
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecredit
                                                                              .leaveTypeBy
                                                                              ?.id,
                                                                      )
                                                                        ? `${(Number(leavecredit.entitled) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecredit.entitled).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecredit.used
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecredit
                                                                              .leaveTypeBy
                                                                              ?.id,
                                                                      )
                                                                        ? `${(Number(leavecredit.used) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecredit.used).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {leavecredit.balance
                                                                    ? [
                                                                          9, 10,
                                                                      ].includes(
                                                                          leavecredit
                                                                              .leaveTypeBy
                                                                              ?.id,
                                                                      )
                                                                        ? `${(Number(leavecredit.balance) / 0.125).toFixed(2)} hrs`
                                                                        : `${Number(leavecredit.balance).toFixed(3)} days`
                                                                    : "-"}
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                {auth.user
                                                                    .role ==
                                                                    "admin" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                leavecredit.id,
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
                                                                )}

                                                                {auth.user
                                                                    .role ==
                                                                    "admin" && (
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            deleteLeaveCredit(
                                                                                leavecredit,
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
                                                                )}
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
                                            leavecredits &&
                                            leavecredits.meta.links
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
                        leavetypes={leavetypes}
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
                        leavetypes={leavetypes}
                        leavecredits={selectedLeaveCredit}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
                <Modal
                    show={showModalImport}
                    onClose={() => setShowModalImport(false)}
                    closeable={true}
                    maxWidth="3xl" // ← use this to expand the modal
                >
                    <Import closeModal={() => setShowModalImport(false)} />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
