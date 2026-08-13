import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import React from "react";
import { router } from "@inertiajs/react";
const Credit = ({
    leavecredits,
    totalCount,
    currentPageCount,
    currentPage,
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
            <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="employee_id"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Employee Name
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
                                name="year"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Year
                            </TableHeading>
                            <TableHeading
                                name="entitled"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Entitled
                            </TableHeading>
                            <TableHeading
                                name="used"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Used
                            </TableHeading>
                            <TableHeading
                                name="balance"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Balance
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {leavecredits && leavecredits.data.length > 0 ? (
                            leavecredits.data.map((leavecredit) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={leavecredit.id}
                                >
                                    {/* <td className="px-3 py-2">
                                                                  {leavecredit.id}
                                                              </td> */}
                                    <td className="px-3 py-2">
                                        {leavecredit.employeeBy.lastname +
                                            ", " +
                                            leavecredit.employeeBy.firstname +
                                            " " +
                                            leavecredit.employeeBy.middlename}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecredit.leaveTypeBy?.name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecredit.year}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecredit.entitled
                                            ? [9, 10].includes(
                                                  leavecredit.leaveTypeBy?.id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecredit.entitled
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecredit.entitled
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecredit.used
                                            ? [9, 10].includes(
                                                  leavecredit.leaveTypeBy?.id
                                              )
                                                ? `${(
                                                      Number(leavecredit.used) /
                                                      0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecredit.used
                                                  ).toFixed(3)} days`
                                            : "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {leavecredit.balance
                                            ? [9, 10].includes(
                                                  leavecredit.leaveTypeBy?.id
                                              )
                                                ? `${(
                                                      Number(
                                                          leavecredit.balance
                                                      ) / 0.125
                                                  ).toFixed(2)} hrs`
                                                : `${Number(
                                                      leavecredit.balance
                                                  ).toFixed(3)} days`
                                            : "-"}
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
                <Pagination
                    links={leavecredits && leavecredits.meta.links}
                    totalCount={totalCount}
                    currentPageCount={currentPageCount}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default Credit;
