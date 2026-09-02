import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    auth,
    employmentStatus,
    ctoLeave,
    personneleaves,
    leavetypes,
    activitytypes,
    personneleaveedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [isDisabled, setIsDisabled] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalApprove, setShowModalApprove] = useState(false);
    const [selectedPersonnelLeave, setSelectedPersonnelLeave] = useState(
        personneleaveedits || null
    );

    const handleEditClick = async (personnelleaveId) => {
        try {
            const response = await axios.get(
                `/user/myleave/${personnelleaveId}/edit`
            );
            setSelectedPersonnelLeave(response.data); // Set the fetched product data
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

            router.get(route("employeeleave.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "personneleaves",
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
        router.get(route("employeeleave.index"), queryParams);
    };

    const rejectedApproval = personneleaves.approvals?.find(
        (approval) => approval.status === "rejected"
    );

    const deleteCompany = (personnelleave) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${personnelleave.employee_id} employee id leave?`
            )
        ) {
            return;
        }
        router.delete(route("employeeleave.destroy", personnelleave.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Employee Leave
                </h2>
            }
        >
            <Head title="Employee Leave" />

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
                                        disabled={isDisabled}
                                        className={`flex items-center gap-2 py-2 px-4 text-white rounded-lg shadow-sm transition-all
        ${
            isDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600"
        }`}
                                    >
                                        <FaPlus size={14} />
                                        <span>New</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
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
                                                    name="leave_type"
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
                                                    name="start_date"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Start Date
                                                </TableHeading>
                                                <TableHeading
                                                    name="end_date"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    End Date
                                                </TableHeading>
                                                <TableHeading
                                                    name="status"
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
                                                <th className="px-3 py-2">
                                                    Remarks
                                                </th>
                                                <th className="px-3 py-2">
                                                    Date Applied
                                                </th>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {personneleaves &&
                                            personneleaves.data.length > 0 ? (
                                                personneleaves.data.map(
                                                    (personneleave) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                personneleave.id
                                                            }
                                                        >
                                                            {/* <td className="px-3 py-2">
                                                                {
                                                                    personneleave.id
                                                                }
                                                            </td> */}
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personneleave
                                                                        .employeeBy
                                                                        .employee_id
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {personneleave.employeeBy
                                                                    ? personneleave
                                                                          .employeeBy
                                                                          .lastname +
                                                                      ", " +
                                                                      personneleave
                                                                          .employeeBy
                                                                          .firstname +
                                                                      " " +
                                                                      personneleave.employeeBy.middlename.charAt(
                                                                          0
                                                                      ) +
                                                                      "."
                                                                    : ""}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personneleave
                                                                        .leaveType
                                                                        ?.name
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {personneleave.start_date
                                                                    ? new Date(
                                                                          personneleave.start_date
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
                                                                {personneleave.end_date
                                                                    ? new Date(
                                                                          personneleave.end_date
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
                                                                {personneleave.approvals?.map(
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
                                                                                        : approval.status ===
                                                                                          "auto-approved"
                                                                                        ? "text-green-600"
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
                                                                            <span>
                                                                                {personneleave
                                                                                    .refunds
                                                                                    ?.length >
                                                                                0
                                                                                    ? personneleave
                                                                                          .refunds[0]
                                                                                          .reason
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personneleave.approvals?.find(
                                                                        (
                                                                            approval
                                                                        ) =>
                                                                            approval.status ===
                                                                            "rejected"
                                                                    )?.remarks
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {personneleave.created_at
                                                                    ? new Date(
                                                                          personneleave.created_at
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

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                {personneleave
                                                                    .employeeBy
                                                                    ?.employee_id ===
                                                                    auth.user
                                                                        .employee_id &&
                                                                    !personneleave.approvals?.some(
                                                                        (a) =>
                                                                            a.status ===
                                                                                "approved" ||
                                                                            a.status ===
                                                                                "rejected"
                                                                    ) && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEditClick(
                                                                                    personneleave.id
                                                                                )
                                                                            }
                                                                            className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                        >
                                                                            <span className="text-green-500">
                                                                                Edit
                                                                            </span>
                                                                        </button>
                                                                    )}

                                                                {(auth.user
                                                                    .role ===
                                                                    "admin" ||
                                                                    (personneleave
                                                                        .employeeBy
                                                                        ?.employee_id ===
                                                                        auth
                                                                            .user
                                                                            .employee_id &&
                                                                        personneleave
                                                                            .approvals
                                                                            ?.length >
                                                                            0 &&
                                                                        personneleave.approvals.every(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                [
                                                                                    "approved",
                                                                                    "auto-approved",
                                                                                ].includes(
                                                                                    a.status
                                                                                )
                                                                        ) &&
                                                                        !personneleave.approvals.some(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                a.status ===
                                                                                "rejected"
                                                                        ))) && (
                                                                    <>
                                                                        {personneleave
                                                                            ?.leaveType
                                                                            ?.id ===
                                                                        10 ? (
                                                                            <>
                                                                                {/* Print CTO */}
                                                                                <button
                                                                                    onClick={() =>
                                                                                        window.open(
                                                                                            `/user/export-pdf-cto/${personneleave.id}`,
                                                                                            "_blank"
                                                                                        )
                                                                                    }
                                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                                >
                                                                                    <span className="text-red-500">
                                                                                        Print
                                                                                        CTO
                                                                                    </span>
                                                                                </button>

                                                                                {/* Print Regular Leave */}
                                                                                <button
                                                                                    onClick={() =>
                                                                                        window.open(
                                                                                            `/user/export-pdf-leave/${personneleave.id}`,
                                                                                            "_blank"
                                                                                        )
                                                                                    }
                                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                                >
                                                                                    <span className="text-blue-500">
                                                                                        Print
                                                                                        Leave
                                                                                    </span>
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            /* Regular Leave only */
                                                                            <button
                                                                                onClick={() =>
                                                                                    window.open(
                                                                                        `/user/export-pdf-leave/${personneleave.id}`,
                                                                                        "_blank"
                                                                                    )
                                                                                }
                                                                                className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                            >
                                                                                <span className="text-red-500">
                                                                                    Print
                                                                                </span>
                                                                            </button>
                                                                        )}
                                                                    </>
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
                                            personneleaves &&
                                            personneleaves.meta.links
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
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Create
                        user={auth}
                        ctoLeave={ctoLeave}
                        employmentStatus={employmentStatus}
                        leavetypes={leavetypes}
                        activitytypes={activitytypes}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Edit
                        user={auth}
                        employeeleaves={selectedPersonnelLeave}
                        employmentStatus={employmentStatus}
                        leavetypes={leavetypes}
                        activitytypes={activitytypes}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
