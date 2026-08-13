import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { router } from "@inertiajs/react";

const Pending = ({
    auth,
    personneleaves,
    queryParams,
    totalCount,
    currentPage,
    currentPageCount,
    toolbar,
}) => {
    console.log(personneleaves);

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

    return (
        <>
            <div className="overflow-auto">
                <div className="flex items-center justify gap-3 mb-5">
                    {toolbar}
                </div>
            </div>
            <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
                <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="employee_id"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Employee Id
                            </TableHeading>
                            <TableHeading
                                name="lastname"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Employee Name
                            </TableHeading>
                            <TableHeading
                                name="leave_type"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Leave Type
                            </TableHeading>
                            <TableHeading
                                name="leavespent"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Leave Spent
                            </TableHeading>

                            <TableHeading
                                name="start_date"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Start Date
                            </TableHeading>
                            <TableHeading
                                name="end_date"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                End Date
                            </TableHeading>
                            <th className="px-3 py-2">Leave Mode</th>
                            <TableHeading
                                name="status"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Status
                            </TableHeading>

                            <th className="px-3 py-2">Date Applied</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personneleaves && personneleaves.data.length > 0 ? (
                            personneleaves.data.map((personneleave) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={personneleave.id}
                                >
                                    <td className="px-3 py-2">
                                        {personneleave.employeeBy.employee_id}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.employeeBy
                                            ? personneleave.employeeBy
                                                  .lastname +
                                              ", " +
                                              personneleave.employeeBy
                                                  .firstname +
                                              " " +
                                              personneleave.employeeBy.middlename.charAt(
                                                  0
                                              ) +
                                              "."
                                            : ""}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.leaveType?.name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.leavespent}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.start_date
                                            ? new Date(
                                                  personneleave.start_date
                                              ).toLocaleDateString("en-US", {
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  year: "numeric",
                                              })
                                            : ""}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.end_date
                                            ? new Date(
                                                  personneleave.end_date
                                              ).toLocaleDateString("en-US", {
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  year: "numeric",
                                              })
                                            : ""}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.leave_mode}
                                    </td>
                                    <td className="px-3 py-2">
                                        {personneleave.approvals?.map(
                                            (approval) => (
                                                <div
                                                    key={approval.id}
                                                    className="flex gap-2"
                                                >
                                                    <span className="font-medium">
                                                        {approval.level}:
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
                                                        {approval.status}
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {approval.approved_at}
                                                    </span>
                                                    <span>
                                                        {personneleave.refunds
                                                            ?.length > 0
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
                                        {personneleave.created_at
                                            ? new Date(
                                                  personneleave.created_at
                                              ).toLocaleDateString("en-US", {
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  year: "numeric",
                                              })
                                            : ""}
                                    </td>

                                    <td className="px-3 py-2 flex text-nowrap">
                                        {personneleave.approvals?.some(
                                            (a) =>
                                                a.approver_id ==
                                                    auth.user.employee_id &&
                                                a.status === "pending"
                                        ) && (
                                            <button
                                                onClick={() =>
                                                    handleApproveClick(
                                                        personneleave.id
                                                    )
                                                }
                                                className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                            >
                                                <span className="text-gray-400 m-2">
                                                    |
                                                </span>
                                                <span className="text-blue-500">
                                                    Approve
                                                </span>
                                            </button>
                                        )}
                                        {(auth.user.role === "admin" ||
                                            (personneleave.employeeBy
                                                ?.employee_id ===
                                                auth.user.employee_id &&
                                                personneleave.approvals
                                                    ?.length > 0 &&
                                                personneleave.approvals.every(
                                                    (a) =>
                                                        [
                                                            "approved",
                                                            "auto-approved",
                                                        ].includes(a.status)
                                                ) &&
                                                !personneleave.approvals.some(
                                                    (a) =>
                                                        a.status === "rejected"
                                                ))) && (
                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        personneleave.leaveType
                                                            .id === 10
                                                            ? `/user/export-pdf-cto/${personneleave.id}`
                                                            : `/user/export-pdf-leave/${personneleave.id}`,
                                                        "_blank"
                                                    )
                                                }
                                                className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                            >
                                                {" "}
                                                <span className="text-red-500">
                                                    Print
                                                </span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                links={personneleaves && personneleaves.meta.links}
                totalCount={totalCount}
                currentPageCount={currentPageCount}
                currentPage={currentPage}
            />
        </>
    );
};

export default Pending;
