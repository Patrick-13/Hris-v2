import React from "react";

export const ProtectedNav = ({ moduleId, isLoadingModules, hasModule, width, children }) => {
    if (isLoadingModules) {
        return (
            <div
                className={`h-6 ${width} rounded-md my-2 relative overflow-hidden bg-gray-300 dark:bg-gray-700`}
            >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent" />
            </div>
        );
    }

    return hasModule(moduleId) ? children : null;
};
