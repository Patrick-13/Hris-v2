import GlobalSearch from "@/Components/GlobalSearch";
import React, { useState } from "react";
import SidebarMobile from "./Sidebar/SidebarMobile";
import SidebarMobileUser from "./Sidebar/SidebarMobileUser";

export const Header = ({ header, user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-800 shadow sm:hidden">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-600 dark:text-gray-300"
                >
                    ☰
                </button>
                <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">
                    {header}
                </h2>
            </header>
            {sidebarOpen &&
                (user.role === "admin" ? (
                    <SidebarMobile setSidebarOpen={setSidebarOpen} />
                ) : (
                    <SidebarMobileUser setSidebarOpen={setSidebarOpen} />
                ))}

            {header && (
                <div className="hidden sm:flex items-center justify-between bg-primary-900 p-6 text-gray-100 dark:text-gray-200">
                    {/* Center: Header Title */}
                    <div className="text-xl font-semibold text-gray-200">
                        {header}
                    </div>

                    <GlobalSearch />
                </div>
            )}
        </>
    );
};
