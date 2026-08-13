import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { router } from "@inertiajs/react";


const Approved = ({
    toolbar,
    personnelovertimeapproved,
    queryParams = null,
    totalCountapproved,
    currentPageCountapproved,
    currentPageapproved,
}) => {
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
                            </tr>
                        </thead>
                        <tbody>
                            {personnelovertimeapproved &&
                            personnelovertimeapproved.data.length > 0 ? (
                                personnelovertimeapproved.data.map(
                                    (personnelovertime) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={personnelovertime.id}
                                        >
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
                            personnelovertimeapproved &&
                            personnelovertimeapproved.meta.links
                        }
                        totalCountapproved={totalCountapproved}
                        currentPageCountapproved={currentPageCountapproved}
                        currentPageapproved={currentPageapproved}
                    />
                </div>
            </div>
        </>
    );
};

export default Approved;
