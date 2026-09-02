import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { useState } from "react";
import Modal from "@/Components/Modal";
import ShowAccomplishment from "../Modal/ShowAccomplishment";
import { router } from "@inertiajs/react";
import Approve from "../Modal/Approve";

const Pending = ({
    auth,
    toolbar,
    personnelaccomplishments,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showModalAccomplishment, setShowModalAccomplishment] =
        useState(false);
    const [showModalAccomplishmentApproved, setShowModalAccomplishmentApproved] = useState(false);
    const [selectedAccomplishmentOvertime, setSelectedAccomplishmentOvertime] =
        useState(null);

    const handleAccomplishmentClick = async (personnelovertimeId) => {
        try {
            const response = await axios.get(
                `/user/employeeovertime/${personnelovertimeId}/showaccomplishment`
            );
            console.log(response.data);
            setSelectedAccomplishmentOvertime(response.data);
            setShowModalAccomplishment(true);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const formatName = (emp) => {
        if (!emp) return "-";

        const mi = emp.middlename ? emp.middlename[0].toUpperCase() + "." : "";

        return `${emp.lastname}, ${emp.firstname} ${mi}`;
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
        router.get(route("employeeaccomplishment.index"), queryParams);
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
            route("aro.bulk-approve"),
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleBulkReturned = () => {
        if (
            !window.confirm(
                `Returned ${selectedIds.length} Accomplishment request(s)?`
            )
        ) {
            return;
        }

        router.post(
            route("aro.bulk-returned"),
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const canBulkApprove = () => {
        if (selectedIds.length === 0) return false;

        return personnelaccomplishments.data.some(
            (accomplishment) =>
                selectedIds.includes(accomplishment.id) &&
                accomplishment.approvals?.some(
                    (a) =>
                        a.approver?.employee_id === auth.user.employee_id &&
                        a.status !== "approved"
                )
        );
    };

    const handleApproveClick = async (accomplishmentId) => {
        try {
            const response = await axios.get(`/aro/${accomplishmentId}`);
            setSelectedAccomplishmentOvertime(response.data);
            setShowModalAccomplishmentApproved(true);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };
    return (
        <>
            <div className="overflow-auto">
                <div className="flex items-center justify gap-3 mb-5">
                    {toolbar}

                    <button
                        disabled={!canBulkApprove()}
                        onClick={handleBulkApprove}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg shadow-sm transition-all
        ${
            !canBulkApprove()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
                    >
                        Bulk Approve ({selectedIds.length})
                    </button>

                    <button
                        disabled={!canBulkApprove()}
                        onClick={handleBulkReturned}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg shadow-sm transition-all
        ${
            !canBulkApprove()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
        }`}
                    >
                        Bulk Returned ({selectedIds.length})
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
                                                    ? personnelaccomplishments.data.map(
                                                          (o) => o.id
                                                      )
                                                    : []
                                            )
                                        }
                                        checked={
                                            personnelaccomplishments?.data
                                                .length > 0 &&
                                            selectedIds.length ===
                                                personnelaccomplishments.data
                                                    .length
                                        }
                                    />
                                </th>
                                <th>Employee Name</th>

                                <TableHeading
                                    name="overtime_id"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    OT Accomplishment Report
                                </TableHeading>

                                <TableHeading
                                    name="request_status"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Status
                                </TableHeading>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnelaccomplishments &&
                            personnelaccomplishments.data.length > 0 ? (
                                personnelaccomplishments.data.map(
                                    (personnelaccomplishment) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={personnelaccomplishment.id}
                                        >
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        personnelaccomplishment.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds([
                                                                ...selectedIds,
                                                                personnelaccomplishment.id,
                                                            ]);
                                                        } else {
                                                            setSelectedIds(
                                                                selectedIds.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        personnelaccomplishment.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                {formatName(
                                                    personnelaccomplishment
                                                        .overtime?.employeeBy
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                <button
                                                    onClick={() =>
                                                        handleAccomplishmentClick(
                                                            personnelaccomplishment
                                                                .overtime.id
                                                        )
                                                    }
                                                    className="flex items-center justify-center text-blue-600 hover:underline"
                                                >
                                                    <span>View Report</span>
                                                </button>
                                            </td>

                                            <td className="px-3 py-2">
                                                {personnelaccomplishment.approvals?.map(
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
                                                                          "returned"
                                                                        ? "text-amber-600"
                                                                        : approval.status ===
                                                                          "rejected"
                                                                        ? "text-red-600"
                                                                        : approval.status ===
                                                                          "waiting"
                                                                        ? "text-blue-600"
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
                                                <button
                                                    onClick={() =>
                                                        handleApproveClick(
                                                            personnelaccomplishment.id
                                                        )
                                                    }
                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                >
                                                    <span className="text-blue-500">
                                                        Approve
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
                            personnelaccomplishments &&
                            personnelaccomplishments.meta.links
                        }
                        totalCount={totalCount}
                        currentPageCount={currentPageCount}
                        currentPage={currentPage}
                    />
                </div>
            </div>
            <Modal
                show={showModalAccomplishment}
                onClose={() => setShowModalAccomplishment(false)}
                closeable={true}
                maxWidth="4xl"
            >
                <ShowAccomplishment
                    employeeovertimes={selectedAccomplishmentOvertime}
                    closeModal={() => setShowModalAccomplishment(false)}
                />
            </Modal>

            <Modal
                show={showModalAccomplishmentApproved}
                onClose={() => setShowModalAccomplishment(false)}
                closeable={true}
                maxWidth="4xl"
            >
                <Approve
                    employeeovertimes={selectedAccomplishmentOvertime}
                    closeModal={() => setShowModalAccomplishment(false)}
                />
            </Modal>
        </>
    );
};

export default Pending;
