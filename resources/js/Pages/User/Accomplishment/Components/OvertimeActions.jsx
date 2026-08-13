export default function OvertimeActions({
    personnelovertime,
    auth,
    onApprove,
}) {
    const userId = auth.user.employee_id;

    const approvals = personnelovertime.approvals || [];

    const canApprove = approvals.some(
        (a) => a.approver_id === userId && a.status !== "approved"
    );

    return (
        <td className="px-3 py-2 flex text-nowrap">
            {/* APPROVE */}
            {canApprove && (
                <button
                    onClick={() => onApprove(personnelovertime.id)}
                    className="font-medium hover:underline mx-1"
                >
                    <span className="text-blue-500">Approve</span>
                </button>
            )}
        </td>
    );
}
