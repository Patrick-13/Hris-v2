import TableHeading from "@/Components/TableHeading";
import React from "react";
import { router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
const Logs = ({
    leavecreditlogs,
    logstotalCount,
    logscurrentPageCount,
    logscurrentPage,
    queryParams,
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
        router.get(route("leavecredit.index"), queryParams);
    };
    return (
        <div className="overflow-x-auto">
            <div className="md:h-[650px] lg:h-[650px] overflow-y-auto">
                <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="employee_name"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Employee Name
                            </TableHeading>

                            <TableHeading
                                name="month"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Month
                            </TableHeading>

                            <TableHeading
                                name="leave_type_id"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Leave Type
                            </TableHeading>
                            <TableHeading
                                name="earned"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Earned
                            </TableHeading>

                            <TableHeading
                                name="late_equivalent_days"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Absence/Tardiness/Undertime
                            </TableHeading>
                            <TableHeading
                                name="before_balance"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Before Balance
                            </TableHeading>
                            <TableHeading
                                name="after_balance"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                New Balance
                            </TableHeading>
                            <TableHeading
                                name="remarks"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Remarks
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {leavecreditlogs && leavecreditlogs.data.length > 0 ? (
                            leavecreditlogs.data.map((leavecreditlog) => (
                                <tr
                                    className="bg-white border-b text-left dark:bg-gray-800 dark:border-gray-700"
                                    key={leavecreditlog.id}
                                >
                                    <td className="px-3 py-2">
                                        {leavecreditlog.employee_name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {new Date(
                                            leavecreditlog.year,
                                            leavecreditlog.month - 1
                                        ).toLocaleString("default", {
                                            month: "long",
                                        })}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecreditlog.leaveType?.name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecreditlog.earned
                                            ? [9, 10].includes(
                                                  leavecreditlog.leave_type_id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecreditlog.earned
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecreditlog.earned
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>

                                    <td className="px-3 py-2">
                                        {leavecreditlog.late_equivalent_days
                                            ? [9, 10].includes(
                                                  leavecreditlog.leave_type_id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecreditlog.late_equivalent_days
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecreditlog.late_equivalent_days
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecreditlog.before_balance
                                            ? [9, 10].includes(
                                                  leavecreditlog.leave_type_id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecreditlog.before_balance
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecreditlog.before_balance
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecreditlog.after_balance
                                            ? [9, 10].includes(
                                                  leavecreditlog.leave_type_id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecreditlog.after_balance
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecreditlog.after_balance
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecreditlog.remarks}
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
                links={leavecreditlogs && leavecreditlogs.meta.links}
                logstotalCount={logstotalCount}
                logscurrentPageCount={logscurrentPageCount}
                logscurrentPage={logscurrentPage}
            />
        </div>
    );
};

export default Logs;
