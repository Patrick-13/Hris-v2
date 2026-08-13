import { LayoutDashboard, Clock } from "lucide-react";

const ComingSoonCard = () => {
    return (
        <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-blue-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        Dashboard Overview
                    </h3>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Clock className="h-7 w-7 text-blue-500" />
                </div>

                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Coming Soon
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                    We’re working on powerful dashboard insights to help you
                    monitor attendance, trends, and performance in real time.
                </p>

                <span className="mt-4 inline-block text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    🚧 Under Development
                </span>
            </div>
        </div>
    );
};

export default ComingSoonCard;
