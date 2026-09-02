import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaPaperclip, FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import OvertimeActions from "./Components/OvertimeActions";
import Attached from "./Modal/Attached";
import ShowAccomplishment from "./Modal/ShowAccomplishment";
import OvertimeHistoryDrawer from "./Components/OvertimeHistoryDrawer";
import { History } from "lucide-react";

export default function Index({
    auth,
    personnelovertimes,
    personnelovertimeedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(personnelovertimes);
    queryParams = queryParams || {};
    const [isDisabled, setIsDisabled] = useState(false);
    const debounceTimeout = useRef(null);
    const [selectedOvertime, setSelectedOvertime] = useState(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAttachment, setShowModalAttachment] = useState(false);
    const [showModalAccomplishment, setShowModalAccomplishment] =
        useState(false);
    const [selectedPersonnelOvertime, setSelectedPersonnelOvertime] = useState(
        personnelovertimeedits || null
    );

    const [selectedAccomplishmentOvertime, setSelectedAccomplishmentOvertime] =
        useState(null);

    const handleEditClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/user/employeeovertime/${personnelovertimeId}/edit`
            );
            setSelectedPersonnelOvertime(response.data); // Set the fetched product data
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching  data:", error);
        }
    };

    const handleAttachementClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/user/employeeovertime/${personnelovertimeId}/attachment`
            );
            setSelectedPersonnelOvertime(response.data);
            setShowModalAttachment(true);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleAccomplishmentClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/user/employeeovertime/${personnelovertimeId}/showaccomplishment`
            );
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
                                                <th>Attachment</th>
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
                                                <th className="px-3 py-2">
                                                    Remarks
                                                </th>
                                                <th className="px-3 py-2">
                                                    ARO
                                                </th>
                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
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
                                                                {personnelovertime.attachment_file ? (
                                                                    <a
                                                                        href={`/user/myovertime/${encodeURIComponent(
                                                                            personnelovertime.attachment_file
                                                                        ).replace(
                                                                            /%2F/g,
                                                                            "/"
                                                                        )}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 hover:underline"
                                                                    >
                                                                        Attachment
                                                                        File
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        No
                                                                        Attachment
                                                                    </span>
                                                                )}
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
                                                                                        : approval.status ===
                                                                                          "returned"
                                                                                        ? "text-purple-600"
                                                                                        : approval.status ===
                                                                                          "waiting"
                                                                                        ? "text-amber-600"
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
                                                            <td className="px-3 py-2">
                                                                {
                                                                    personnelovertime.approvals?.find(
                                                                        (
                                                                            approval
                                                                        ) =>
                                                                            approval.status ===
                                                                                "rejected" ||
                                                                            approval.status ===
                                                                                "returned"
                                                                    )?.remarks
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2 text-center">
                                                                {personnelovertime
                                                                    .accomplishments
                                                                    ?.length >
                                                                0 ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleAccomplishmentClick(
                                                                                personnelovertime.id
                                                                            )
                                                                        }
                                                                        className="flex items-center justify-center text-blue-600 hover:underline"
                                                                    >
                                                                        <FaPaperclip
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="mr-1"
                                                                        />
                                                                        <span>
                                                                            View
                                                                            Report
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-gray-400 italic">
                                                                        No
                                                                        Report
                                                                        Created
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                <OvertimeActions
                                                                    personnelovertime={
                                                                        personnelovertime
                                                                    }
                                                                    auth={auth}
                                                                    onEdit={
                                                                        handleEditClick
                                                                    }
                                                                    onAttach={
                                                                        handleAttachementClick
                                                                    }
                                                                />

                                                                <div className="group relative">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedOvertime(
                                                                                personnelovertime
                                                                            );
                                                                            setHistoryOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                                                                    >
                                                                        <History className="h-5 w-5" />
                                                                    </button>

                                                                    {/* Tooltip */}
                                                                    <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                                                        History
                                                                    </span>
                                                                </div>
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
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Create
                        user={auth}
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
                        employeeovertimes={selectedPersonnelOvertime}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>

                <Modal
                    show={showModalAttachment}
                    onClose={() => setShowModalAttachment(false)}
                    closeable={true}
                    maxWidth="4xl"
                >
                    <Attached
                        employeeovertimes={selectedPersonnelOvertime}
                        closeModal={() => setShowModalAttachment(false)}
                    />
                </Modal>

                <Modal
                    show={showModalAccomplishment}
                    onClose={() => setShowModalAccomplishment(false)}
                    closeable={true}
                    maxWidth="4xl"
                >
                    <ShowAccomplishment
                        auth={auth}
                        employeeovertimes={selectedAccomplishmentOvertime}
                        personnelovertimeedits={personnelovertimeedits}
                        closeModal={() => setShowModalAccomplishment(false)}
                    />
                </Modal>

                <OvertimeHistoryDrawer
                    open={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                    histories={selectedOvertime?.approvalHistories ?? []}
                />
            </div>
        </AuthenticatedLayout>
    );
}
