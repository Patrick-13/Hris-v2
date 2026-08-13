import { FaPlusCircle } from "react-icons/fa";

export default function OvertimeActions({
    personnelovertime,
    auth,
    onEdit,
    onAttach,
}) {
    const userId = auth.user.employee_id;

    const approvals = personnelovertime.approvals || [];

    const isOwner = personnelovertime.employeeBy?.employee_id === userId;

    const hasAnyApproved = approvals.some((a) => a.status === "approved");

    const hasAnyRejected = approvals.some((a) => a.status === "rejected");

    const hasAllReturned = approvals.some((a) => a.status === "returned");

    const isRdReturned = approvals.some(
        (a) => a.level === "rd" && a.status === "returned"
    );

    const hasAccomplishment =
        personnelovertime.accomplishments &&
        personnelovertime.accomplishments.length > 0;

    // assuming regional is the final approver
    const isFinalApproved = approvals.some(
        (a) => a.level === "rd" && a.status === "approved"
    );

    const canEdit =
        isOwner &&
        ((!hasAnyApproved && !hasAnyRejected && !isRdReturned) ||
            hasAllReturned);

    const canAttach = isFinalApproved && !hasAccomplishment;

    return (
        <td className="px-3 py-2 flex text-nowrap">
            {/* EDIT */}
            {canEdit && (
                <button
                    onClick={() => onEdit(personnelovertime.id)}
                    className="font-medium hover:underline mx-1"
                >
                    <span className="text-green-500">Edit</span>
                </button>
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
