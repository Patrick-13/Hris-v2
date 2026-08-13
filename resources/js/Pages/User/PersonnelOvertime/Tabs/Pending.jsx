import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { router } from "@inertiajs/react";
import { useState } from "react";
import Approve from "../Modal/Approve";
import { FaPaperclip } from "react-icons/fa";
import OvertimeActions from "../Components/OvertimeActions";
import OvertimeHistoryDrawer from "../../MyOvertime/Components/OvertimeHistoryDrawer";
import { History } from "lucide-react";

const Pending = ({
    auth,
    toolbar,
    personnelovertimes,
    personnelovertimeedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedOvertime, setSelectedOvertime] = useState(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [showModalApprove, setShowModalApprove] = useState(false);
    const [selectedPersonnelOvertime, setSelectedPersonnelOvertime] = useState(
        personnelovertimeedits || null
    );

    const handleApproveClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/user/employeeovertime/${personnelovertimeId}`
            );
            setSelectedPersonnelOvertime(response.data);
            setShowModalApprove(true);
        } catch (error) {
            console.error("Error fetching  data:", error);
        }
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

    const handleBulkApprove = () => {
        if (
            !window.confirm(
                `Approve ${selectedIds.length} Accomplishment request(s)?`
            )
        ) {
            return;
        }

        router.post(
            route("employeeovertime.bulk-approve"),
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    return (
        <>
            <div className="overflow-auto">
                <div className="flex items-center justify gap-3 mb-5">
                    {toolbar}

                    <button
                        onClick={handleBulkApprove}
                        className="flex items-center bg-blue-600 text-white gap-2 py-2 px-4 rounded-lg shadow-sm transition-all"
                    >
                        Bulk Approve ({selectedIds.length})
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                            <tr className="text-nowrap">
                                <th className="px-3 py-2">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setSelectedIds(
                                                e.target.checked
                                                    ? personnelovertimes.data.map(
                                                          (o) => o.id
                                                      )
                                                    : []
                                            )
                                        }
                                        checked={
                                            personnelovertimes?.data.length >
                                                0 &&
                                            selectedIds.length ===
                                                personnelovertimes.data.length
                                        }
                                    />
                                </th>
                                <TableHeading
                                    name="lastname"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Employee Name
                                </TableHeading>
                                <TableHeading
                                    name="date_of_request"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Date of Request
                                </TableHeading>
                                <TableHeading
                                    name="purpose_of_overtime"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Purpose
                                </TableHeading>
                                <TableHeading
                                    name="justification"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Justification
                                </TableHeading>
                                <TableHeading
                                    name="work_to_accomplished"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Work to Accomplished
                                </TableHeading>
                                <TableHeading
                                    name="duration_hours"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    # of Hours
                                </TableHeading>
                                <TableHeading
                                    name="date_of_overtime"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Date of Overtime
                                </TableHeading>

                                <TableHeading
                                    name="request_status"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Status
                                </TableHeading>
                                <th className="px-3 py-2">Remarks</th>
                                <th className="px-3 py-2">ARO</th>
                                <th className="px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnelovertimes &&
                            personnelovertimes.data.length > 0 ? (
                                personnelovertimes.data.map(
                                    (personnelovertime) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={personnelovertime.id}
                                        >
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        personnelovertime.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds([
                                                                ...selectedIds,
                                                                personnelovertime.id,
                                                            ]);
                                                        } else {
                                                            setSelectedIds(
                                                                selectedIds.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        personnelovertime.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                {personnelovertime.employeeBy
                                                    ? personnelovertime
                                                          .employeeBy.lastname +
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
                                                    (approval) => (
                                                        <div
                                                            key={approval.id}
                                                            className="flex gap-2"
                                                        >
                                                            <span className="font-medium">
                                                                {approval.level}
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
                                                        (approval) =>
                                                            approval.status ===
                                                                "rejected" ||
                                                            approval.status ===
                                                                "returned"
                                                    )?.remarks
                                                }
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {personnelovertime
                                                    .accomplishments?.length >
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
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        <span>View Report</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        No Report Created
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 flex text-nowrap">
                                                <OvertimeActions
                                                    personnelovertime={
                                                        personnelovertime
                                                    }
                                                    auth={auth}
                                                    onApprove={
                                                        handleApproveClick
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedOvertime(
                                                            personnelovertime
                                                        );
                                                        setHistoryOpen(true);
                                                    }}
                                                    className="font-medium hover:underline mx-1"
                                                >
                                                    <span className="text-blue-500">
                                                        History
                                                    </span>
                                                </button>
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
                            personnelovertimes && personnelovertimes.meta.links
                        }
                        totalCount={totalCount}
                        currentPageCount={currentPageCount}
                        currentPage={currentPage}
                    />
                </div>
            </div>
            <Modal
                show={showModalApprove}
                onClose={() => setShowModalApprove(false)}
                closeable={true}
                maxWidth="4xl" // ← use this to expand the modal
            >
                <Approve
                    employeeovertimes={selectedPersonnelOvertime}
                    closeModal={() => setShowModalApprove(false)}
                />
            </Modal>
            <OvertimeHistoryDrawer
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                histories={selectedOvertime?.approvalHistories ?? []}
            />
        </>
    );
};

export default Pending;
