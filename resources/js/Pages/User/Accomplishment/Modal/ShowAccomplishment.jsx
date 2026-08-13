export default function ShowAccomplishment({ employeeovertimes, closeModal }) {
    console.log(employeeovertimes);
    const overtime = employeeovertimes.data[0];

    return (
        <>
            <div className="bg-white w-full mx-4 rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                        Employee Accomplishment Report
                    </h2>
                </div>

                {/* Body */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <strong>Name:</strong>{" "}
                            {overtime.employeeBy?.firstname}{" "}
                            {overtime.employeeBy?.lastname}
                        </div>
                        <div>
                            <strong>Date of Overtime:</strong>{" "}
                            {new Date(
                                overtime.date_of_overtime,
                            ).toLocaleDateString()}
                        </div>
                    </div>

                    <div>
                        <strong>Purpose:</strong>{" "}
                        {overtime.purpose_of_overtime || "-"}
                    </div>
                    <div>
                        <strong>Justification:</strong>{" "}
                        {overtime.justification || "-"}
                    </div>

                    <div>
                        <strong className="block mb-2">Accomplishments:</strong>

                        {overtime.accomplishments?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border text-left w-12">
                                                #
                                            </th>
                                            <th className="px-4 py-2 border text-left">
                                                Work Accomplished
                                            </th>
                                            <th className="px-4 py-2 border text-center w-32">
                                                Duration
                                            </th>
                                            <th className="px-4 py-2 border text-center w-40">
                                                Attachment
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {overtime.accomplishments.map(
                                            (item, idx) => (
                                                <tr
                                                    key={item.id ?? idx}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-2 border text-center">
                                                        {idx + 1}
                                                    </td>

                                                    <td className="px-4 py-2 border">
                                                        {item.work_accomplished}
                                                    </td>

                                                    <td className="px-4 py-2 border text-center">
                                                        {item.duration_hours}{" "}
                                                        hrs
                                                    </td>

                                                    <td className="px-4 py-2 border text-center">
                                                        {item.attachment ? (
                                                            <a
                                                                href={`/employeeovertimeccomplishment/${encodeURIComponent(
                                                                    item.attachment,
                                                                ).replace(
                                                                    /%2F/g,
                                                                    "/",
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                View Attachment
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                No Attachment
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic mt-2">
                                No Report Created
                            </p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
