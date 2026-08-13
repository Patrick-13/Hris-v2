import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";

const Waiting = ({
    toolbar,
    personnelaccomplishmentreturned,
    queryParams = null,
    totalCountreturned,
    currentPageCountreturned,
    currentPagereturned,
}) => {
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

    return (
        <>
            <div className="overflow-auto">
                <div className="flex items-center justify gap-3 mb-5">
                    {toolbar}
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                            <tr className="text-nowrap">
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
                            </tr>
                        </thead>
                        <tbody>
                            {personnelaccomplishmentreturned &&
                            personnelaccomplishmentreturned.data.length > 0 ? (
                                personnelaccomplishmentreturned.data.map(
                                    (personnelaccomplishment) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={personnelaccomplishment.id}
                                        >
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
                            personnelaccomplishmentreturned &&
                            personnelaccomplishmentreturned.meta.links
                        }
                        totalCountreturned={totalCountreturned}
                        currentPageCounereturned={currentPageCountreturned}
                        currentPagereturned={currentPagereturned}
                    />
                </div>
            </div>
        </>
    );
};

export default Waiting;
