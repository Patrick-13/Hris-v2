import { FaPrint } from "react-icons/fa";

export default function Index({ contactdetails, personnelLeave }) {
    console.log(personnelLeave);

    return (
        <div className="py-2">
            <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-x-auto">
                            <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-emerald-600">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">S.O #</th>
                                            <th className="px-3 py-2">Activity Type</th>
                                            <th className="px-3 py-2">Date Conducted</th>
                                            <th className="px-3 py-2">Type</th>
                                            <th className="px-3 py-2">Venue</th>
                                            <th className="px-3 py-2">Description</th>
                                            <th className="px-3 py-2">Status</th>
                                            <th className="px-3 py-2">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {contactdetails && contactdetails.data.length > 0 ? (
                                            contactdetails.data.map((contactdetail) =>
                                                contactdetail.activityBy.map((activity, index) => {
                                                    // ✅ Check if this activity was used
                                                    const used = personnelLeave.some(
                                                        (leave) => leave.activity_id === activity.id
                                                    );

                                                    return (
                                                        <tr
                                                            key={`${activity.id}-${index}`}
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                        >
                                                            <td className="px-3 py-2">{activity.soNumber}</td>
                                                            <td className="px-3 py-2">{activity.activityTypeBy.name}</td>
                                                            <td className="px-3 py-2">
                                                                {new Date(activity.dateFrom).toLocaleDateString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}{" "}
                                                                -{" "}
                                                                {new Date(activity.dateTo).toLocaleDateString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </td>
                                                            <td className="px-3 py-2">{activity.type}</td>
                                                            <td className="px-3 py-2">{activity.venue}</td>
                                                            <td className="px-3 py-2">{activity.description}</td>

                                                            {/* ✅ Status column */}
                                                            <td className="px-3 py-2">
                                                                {used ? (
                                                                    <span className="text-red-500 font-semibold">
                                                                        Used
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-green-600 font-semibold">
                                                                        Not Used
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* ✅ Print button — only if NOT used */}
                                                            <td className="px-3 py-2">
                                                                {!used && (
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                `/user/export-pdf-cto/${activity.id}`,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="font-medium text-blue-500 hover:underline mx-1"
                                                                    >
                                                                        <FaPrint
                                                                            className="text-red-500"
                                                                            size={18}
                                                                        />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
