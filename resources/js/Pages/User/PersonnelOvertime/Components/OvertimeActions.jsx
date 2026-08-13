import { FaEllipsisV, FaPlusCircle } from "react-icons/fa";

export default function OvertimeActions({
    personnelovertime,
    auth,
    onEdit,
    onApprove,
    onAttach,
}) {
    const userId = auth.user.employee_id;

    const approvals = personnelovertime.approvals || [];

    const isOwner = personnelovertime.employeeBy?.employee_id === userId;

    const hasAnyApproved = approvals.some((a) => a.status === "approved");

    const hasAnyReturned = approvals.some((a) => a.status === "returned");

    const hasAccomplishment =
        personnelovertime.accomplishments &&
        personnelovertime.accomplishments.length > 0;

    // assuming regional is the final approver
    const isFinalApproved = approvals.some(
        (a) => a.level === "rd" && a.status === "approved"
    );

    const canEdit = isOwner && hasAnyReturned && !hasAnyApproved;

    const canApprove = approvals.some(
        (a) => a.approver_id === userId && a.status !== "approved"
    );

    const canAttach = isFinalApproved && !hasAccomplishment;

    const canPrint = auth.user.role === "admin" || isFinalApproved;

    return (
        <td className="px-3 py-2 flex text-nowrap">
            {/* APPROVE */}
            {canApprove && (
                <div className="group relative">
                    <button
                        type="button"
                        onClick={() => onApprove(personnelovertime.id)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <FaEllipsisV className="h-5 w-5" />
                    </button>

                    {/* Tooltip */}
                    <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        Take Action
                    </span>
                </div>
            )}

            {/* Attach */}
            {canAttach && (
                <button
                    onClick={() => onAttach(personnelovertime.id)}
                    className="flex items-center gap-2 px-3 py-1 border border-green-500 rounded-lg text-green-600 hover:bg-green-50 hover:shadow-md transition"
                    title="Create Overtime Report"
                >
                    <FaPlusCircle size={18} className="text-green-500" />
                    <span className="font-semibold">Create Report</span>
                </button>
            )}
        </td>
    );
}
