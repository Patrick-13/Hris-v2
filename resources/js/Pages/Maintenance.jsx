export default function Maintenance() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v4m0 4h.01"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800">
                    System Under Maintenance
                </h1>

                {/* Message */}
                <p className="mt-3 text-gray-600">
                    We’re currently performing scheduled maintenance to improve
                    system performance and stability.
                </p>

                <p className="mt-2 text-gray-600">
                    The system is temporarily unavailable. Please try again
                    later.
                </p>

                {/* Status badge */}
                <div className="mt-5">
                    <span className="inline-block px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full">
                        Maintenance Mode Active
                    </span>
                </div>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-400">
                    Thank you for your understanding.
                </p>
            </div>
        </div>
    );
}
