import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import { router } from "@inertiajs/react";
import React from "react";

const Waiting = ({
    tkowaiting,
    toolbar,
    queryParams = null,
    totalCountwaiting,
    currentPageCountwaiting,
    currentPagewaiting,
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
        router.get(route("tko.index"), queryParams);
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
                                    name="tko_type"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Failed to Register?
                                </TableHeading>

                                <TableHeading
                                    name="date"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Date
                                </TableHeading>
                                <TableHeading
                                    name="tko_time"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Time
                                </TableHeading>
                                <TableHeading
                                    name="attachment_file"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    Attachment
                                </TableHeading>
                                <TableHeading
                                    name="remarks"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    remarks
                                </TableHeading>
                                <TableHeading
                                    name="level"
                                    sort_field={queryParams.sort_field}
                                    sort_direction={queryParams.sort_direction}
                                    sortChanged={sortChanged}
                                >
                                    approval status?
                                </TableHeading>
                                <th>Approval Remarks</th>
                                <th>Tko Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tkowaiting && tkowaiting.data.length > 0 ? (
                                tkowaiting.data.map((tko) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        key={tko.id}
                                    >
                                        <td className="px-3 py-2">
                                            {`${
                                                tko.employee_by?.lastname ?? ""
                                            }, ${
                                                tko.employee_by?.firstname ?? ""
                                            }${
                                                tko.employee_by?.middlename
                                                    ? ` ${tko.employee_by.middlename[0]}.`
                                                    : ""
                                            }`}
                                        </td>
                                        <td className="px-3 py-2">
                                            {tko.tko_type}
                                        </td>
                                        <td className="px-3 py-2">
                                            {tko.date
                                                ? new Date(
                                                      tko.date
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
                                            {tko.tko_time}
                                        </td>

                                        <td className="px-3 py-2">
                                            <a
                                                href={`/tko/${encodeURIComponent(
                                                    tko.attachment_file
                                                ).replace(/%2F/g, "/")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                Attachment File
                                            </a>
                                        </td>
                                        <td className="px-3 py-2">
                                            {tko.remarks}
                                        </td>

                                        <td className="px-3 py-2">
                                            {tko.approvals?.map((approval) => (
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
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {approval.status}
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {approval.approved_at}
                                                    </span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-3 py-2">
                                            {
                                                tko.approvals?.find(
                                                    (approval) =>
                                                        approval.status ===
                                                        "rejected"
                                                )?.remarks
                                            }
                                        </td>
                                        <td>
                                            {tko.tko_count >= 3 ? (
                                                <span className="text-red-600 font-semibold">
                                                    Limit Reached (3/3)
                                                </span>
                                            ) : (
                                                <span>
                                                    {tko.tko_count}
                                                    /3
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
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
                        links={tkowaiting && tkowaiting.meta.links}
                        totalCountwaiting={totalCountwaiting}
                        currentPageCountwaiting={currentPageCountwaiting}
                        currentPagewaiting={currentPagewaiting}
                    />
                </div>
            </div>
        </>
    );
};

export default Waiting;
