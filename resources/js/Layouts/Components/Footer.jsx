import React from "react";

export default function Footer() {
    return (
        <footer className="bg-primary-900 dark:bg-gray-800 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <p className="text-xs sm:text-sm md:text-base text-center leading-relaxed break-words">
                    © 2025 EMB XI - Human Resource Management System (HRMS) v.2
                    <span className="block sm:inline">
                        {" "}
                        All rights reserved.
                    </span>
                </p>
            </div>
        </footer>
    );
}
