import { Link, usePage, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { MdLogout } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const SuperuserSidebar = ({ user }) => {
    const { url } = usePage();
    const { post } = useForm();
    const [commandOpen, setCommandOpen] = useState(false);

    const systemItems = [
        {
            submoduleId: 16,
            name: "Module",
            href: route("module.index"),
            active: route().current("module.index"),
        },
        {
            submoduleId: 17,
            name: "Sub Module",
            href: route("submodule.index"),
            active: route().current("submodule.index"),
        },
        {
            submoduleId: 18,
            name: "User Access",
            href: route("usermodule.index"),
            active: route().current("usermodule.index"),
        },
    ];

    const isSystemActive = systemItems.some((item) => item.active);

    const [systemMenuOpen, setSystemMenuOpen] = useState(isSystemActive);

    function handleLogout() {
        post(route("logout"));
    }

    const confirmLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            handleLogout();
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-[#0A3D62] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-200 w-60 shadow-xl">
            {/* Logo Section */}
            <div className="flex items-center justify-center py-6 border-b border-blue-900">
                <span className="text-lg font-bold text-white tracking-wide">
                    Welcome,{" "}
                    <span className="text-emerald-500">
                        {user?.name
                            ? user.name.charAt(0).toUpperCase() +
                              user.name.slice(1).toLowerCase()
                            : ""}
                    </span>
                </span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 mt-4 px-3 space-y-1">
                {/* System Settings Dropdown */}

                <div>
                    <button
                        onClick={() => setSystemMenuOpen(!systemMenuOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                    >
                        <span className="flex items-center gap-3">
                            <CiSettings size={18} /> System Settings
                        </span>
                        {systemMenuOpen ? (
                            <IoChevronUp size={16} />
                        ) : (
                            <IoChevronDown size={16} />
                        )}
                    </button>

                    {systemMenuOpen && (
                        <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                            {systemItems.map((sub) => {
                                const isActive = url === sub.href || sub.active;
                                return (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 
                                        ${
                                            isActive
                                                ? "bg-blue-700 text-white w-64"
                                                : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>
            {/* Footer Section */}
            <div className="mt-auto border-t border-blue-900 px-4 py-4 flex items-center gap-4">
                {/* HOVER CARD */}
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={user?.employee_by?.avatar_url}
                                    alt="User Avatar"
                                />
                                <AvatarFallback className="bg-emerald-500 text-white font-bold flex items-center justify-center">
                                    {user?.name
                                        ?.split(" ")
                                        .map((n) => n.charAt(0).toUpperCase())
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">
                                    {user?.name}
                                </span>
                            </div>
                        </div>
                    </HoverCardTrigger>

                    <HoverCardContent className="w-80 p-4">
                        <div className="flex gap-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    src={user?.employee_by?.avatar_url}
                                    alt="User Avatar"
                                />
                                <AvatarFallback className="bg-emerald-500 text-white font-bold flex items-center justify-center">
                                    {user?.name
                                        ?.split(" ")
                                        .map((n) => n.charAt(0).toUpperCase())
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">
                                    {user?.name}
                                </h4>
                                <span className="text-xs text-gray-400">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>

                {/* LOGOUT BUTTON */}
                <button
                    onClick={confirmLogout}
                    className="flex items-center gap-3 px-4 py-2 ml-auto text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                >
                    <MdLogout size={18} />
                </button>
            </div>
        </div>
    );
};

export default SuperuserSidebar;
