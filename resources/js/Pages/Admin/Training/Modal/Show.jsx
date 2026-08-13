export default function Show({ trainings }) {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-1">{trainings.title}</h1>
                <p className="text-sm opacity-90">
                    {new Date(trainings.dateFrom).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(trainings.dateTo).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Training Details */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Training Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                    <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{trainings.type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="font-medium">{trainings.venue}</p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium">{trainings.description}</p>
                    </div>
                </div>
            </div>

            {/* Participants */}
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                    Participants
                </h2>

                {trainings.employees && trainings.employees.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Employee ID</th>
                                    <th className="px-4 py-2">Full Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainings.employees.map((emp, index) => (
                                    <tr
                                        key={emp.id}
                                        className={`${
                                            index % 2 === 0
                                                ? "bg-white dark:bg-gray-800"
                                                : "bg-gray-50 dark:bg-gray-900"
                                        } border-b border-gray-100 dark:border-gray-700`}
                                    >
                                        <td className="px-4 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2">
                                            {emp.employee_id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {emp.firstname} {emp.lastname}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">
                        No participants found.
                    </p>
                )}
            </div>
        </div>
    );
}
