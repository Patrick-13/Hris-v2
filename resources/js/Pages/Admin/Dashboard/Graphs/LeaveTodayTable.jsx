import React from "react";

const LeaveTodayTable = ({ employeeOnLeave = [] }) => {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Employees on Leave Today
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Employees who are currently on approved leave.
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">#</th>
                            <th className="px-6 py-3 font-semibold">
                                Employee
                            </th>
                            <th className="px-6 py-3 font-semibold">
                                Employee ID
                            </th>
                            <th className="px-6 py-3 font-semibold">
                                Leave Type
                            </th>
                            <th className="px-6 py-3 font-semibold">
                                Start Date
                            </th>
                            <th className="px-6 py-3 font-semibold">
                                End Date
                            </th>
                            <th className="px-6 py-3 font-semibold">Reason</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {employeeOnLeave.length > 0 ? (
                            employeeOnLeave.map((leave, index) => (
                                <tr
                                    key={leave.id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {leave.employee_by
                                                ? `${leave.employee_by.firstname} ${leave.employee_by.lastname}`
                                                : "N/A"}
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        {leave.employee_id}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                            {leave.leave_type?.name || "N/A"}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        {leave.start_date}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        {leave.end_date}
                                    </td>

                                    <td className="max-w-xs px-6 py-4">
                                        <span className="line-clamp-2">
                                            {leave.reason || "N/A"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-10 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm font-medium text-gray-500">
                                            No employees are on leave today.
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Approved leaves for today will
                                            appear here.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveTodayTable;
