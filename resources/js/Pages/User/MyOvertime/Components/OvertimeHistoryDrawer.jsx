export default function OvertimeHistoryDrawer({
    open,
    onClose,
    histories = [],
}) {
    console.log(histories);
    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Right Side Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Return History
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Previous return actions for this overtime request
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close history"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* History Content */}
                <div className="h-[calc(100%-81px)] overflow-y-auto px-6 py-6">
                    {histories.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>

                                <p className="font-medium text-gray-700">
                                    No return history
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    This overtime request has not been returned.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-2 h-full w-px bg-gray-200" />

                            <div className="space-y-6">
                                {histories.map((history, index) => (
                                    <div
                                        key={history.id ?? index}
                                        className="relative flex gap-4"
                                    >
                                        {/* Timeline Dot */}
                                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 ring-4 ring-white">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                        </div>

                                        {/* History Card */}
                                        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            {/* Approver */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {history.approver
                                                            ?.employee_name ??
                                                            history.approver_name ??
                                                            "Unknown approver"}
                                                    </p>

                                                    <p className="mt-0.5 text-xs capitalize text-gray-500">
                                                        {history.level}
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                    Returned
                                                </span>
                                            </div>

                                            {/* Remarks */}
                                            {history.remarks && (
                                                <div className="mt-4">
                                                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Remarks
                                                    </p>

                                                    <p className="text-sm leading-6 text-gray-700">
                                                        {history.remarks}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Date */}
                                            {history.created_at && (
                                                <p className="mt-3 text-xs text-gray-400">
                                                    {new Date(
                                                        history.created_at
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
