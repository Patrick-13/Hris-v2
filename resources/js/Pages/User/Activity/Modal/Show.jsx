import Pagination from "@/Components/Pagination";

export default function Show({ activities }) {
    const {
        activity,
        employees,
        totalCount,
        currentPageCount,
        currentPage,
        links,
    } = activities;

    const totalDays =
        Math.ceil(
            (new Date(activity.dateTo) - new Date(activity.dateFrom)) /
                (1000 * 60 * 60 * 24)
        ) + 1;

    return (
        <div className="py-6">
            {/* header */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                        <h1 className="text-2xl font-bold mb-1">
                            {activity.activityTypeBy.name}
                        </h1>
                        <p className="text-sm opacity-90">
                            {new Date(activity.dateFrom).toLocaleDateString()} -{" "}
                            {new Date(activity.dateTo).toLocaleDateString()}{" "}
                            ({totalDays} {totalDays === 1 ? "day" : "days"})
                        </p>
                    </div>

                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold mb-4">
                            Activity Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="font-medium">{activity.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Venue</p>
                                <p className="font-medium">{activity.venue}</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <p className="text-sm text-gray-500">
                                    Description
                                </p>
                                <p className="font-medium">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-3">
                            Participants
                        </h2>

                        {employees && employees.length > 0 ? (
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-4 py-2">#</th>
                                            <th className="px-4 py-2">
                                                Employee ID
                                            </th>
                                            <th className="px-4 py-2">
                                                Full Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp, index) => (
                                            <tr
                                                key={emp.id}
                                                className={
                                                    index % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }
                                            >
                                                <td className="px-4 py-2">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {emp.employee_id}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {emp.firstname}{" "}
                                                    {emp.lastname}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    links={links}
                                    totalCount={totalCount}
                                    currentPageCount={currentPageCount}
                                    currentPage={currentPage}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                No participants found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
