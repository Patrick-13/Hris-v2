import { Link, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
    MdDashboard,
    MdPeople,
    MdLogout,
    MdOutlineInventory,
    MdOutlinePayments,
} from "react-icons/md";
import { FaFileDownload, FaSitemap } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { FcLeave, FcOvertime } from "react-icons/fc";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import SidebarSearch from "./Sidebar/SidebarSearch";
import { Search } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CiTimer } from "react-icons/ci";
import { useOvertimeNotifications } from "@/Contexts/OvertimeApprovalContext";
import { useAccomplishmentNotifications } from "@/Contexts/AccomplishmentApprovalContext";
import { useLeaveApprovalNotifications } from "@/Contexts/NotificationContext";
import { useTkoNotifications } from "@/Contexts/TkoApprovalContext";

const SidebarGuest = ({ user }) => {
    const { url } = usePage();
    const { post } = useForm();
    const [commandOpen, setCommandOpen] = useState(false);
    const [userModules, setUserModules] = useState([]);
    const [userSubmodules, setUserSubmodules] = useState([]);

    const { pendingCount } = useOvertimeNotifications();
    const { pendingAroCount } = useAccomplishmentNotifications();
    const { pendingLeaveCount } = useLeaveApprovalNotifications();
    const { pendingTkoCount } = useTkoNotifications();

    const totalRaroPending =
        (Number(pendingCount?.["section/unit"]) || 0) +
        (pendingCount?.division || 0) +
        (pendingCount?.rd || 0);

    const totalAroPending =
        (Number(pendingAroCount?.["section/unit"]) || 0) +
        (pendingAroCount?.division || 0) +
        (pendingAroCount?.rd || 0);

    const totalApprovalPending =
        (Number(pendingCount?.["section/unit"]) || 0) +
        (pendingCount?.division || 0) +
        (pendingCount?.rd || 0) +
        (Number(pendingAroCount?.["section/unit"]) || 0) +
        (pendingAroCount?.division || 0) +
        (pendingAroCount?.rd || 0);

    const totalTkoPending =
        (Number(pendingTkoCount?.["section"]) || 0) +
        (Number(pendingTkoCount?.["division"]) || 0) +
        (Number(pendingTkoCount?.["hr"]) || 0);

    const totalLeavePending =
        (Number(pendingLeaveCount?.["unit/section chief"]) || 0) +
        (Number(pendingLeaveCount?.["division chief"]) || 0) +
        (Number(pendingLeaveCount?.["finance"]) || 0) +
        (Number(pendingLeaveCount?.["rd"]) || 0);

    useEffect(() => {
        if (!user?.id) return; // Early return if user ID is not available

        const userId = user.id; // Extract user ID from auth object

        axios
            .get(`/user/${userId}/modules`) // Use the userId dynamically
            .then((response) => {
                setUserModules(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the user modules!",
                    error
                );
            });
    }, [user]);

    useEffect(() => {
        if (!user?.id) return; // Early return if user ID is not available

        const userId = user.id; // Extract user ID from auth object

        axios
            .get(`/user/${userId}/submodules`) // Use the userId dynamically
            .then((response) => {
                setUserSubmodules(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the user modules!",
                    error
                );
            });
    }, [user]);

    const hasModule = (moduleId) => userModules.includes(Number(moduleId));
    const hasSubModule = (submoduleId) =>
        userSubmodules.includes(Number(submoduleId));

    const navItems = [
        {
            moduleId: 1,
            name: "Dashboard",
            href: route("userdashboard"),
            active: route().current("userdashboard"),
            icon: <MdDashboard />,
        },
        {
            moduleId: 11,
            name: "Profile",
            href: route("myinfo.index"),
            active: route().current("myinfo.index"),
            icon: <MdPeople />,
        },
        {
            moduleId: 5,
            name: "Org Chart",
            href: route("orgchart.index"),
            active: route().current("orgchart.index"),
            icon: <FaSitemap />,
        },
        {
            moduleId: 12,
            name: "Activities",
            href: route("myactivity.index"),
            active: route().current("myactivity.index"),
            icon: <FiActivity />,
        },
        // {
        //     moduleId: 13,
        //     name: "My Devices",
        //     href: route("mydevice.index"),
        //     active: route().current("mydevice.index"),
        //     icon: <MdOutlineInventory />,
        // },
        {
            moduleId: 14,
            name: "Attendance",
            href: route("mydtr.index"),
            active: route().current("mydtr.index"),
            icon: <CiTimer />,
        },
        {
            moduleId: 19,
            name: "My Payroll",
            href: route("mypayroll.index"),
            active: route().current("mypayroll.index"),
            icon: <MdOutlinePayments />,
        },
    ];

    const filteredNavItems = navItems.filter((item) =>
        hasModule(item.moduleId)
    );

    const employeeItems = [
        {
            submoduleId: 6,
            name: "Leave Request",
            href: route("myleave.index"),
            active: route().current("myleave.index"),
        },
        {
            submoduleId: 5,
            name: "Leave Credits",
            href: route("myleavecredit.index"),
            active: route().current("myleavecredit.index"),
        },
        {
            submoduleId: 19,
            name: "Leave Approval",
            href: route("employeeleave.index"),
            active: route().current("employeeleave.index"),
            count: totalLeavePending,
        },
    ];

    const filteredEmployeeItems = employeeItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const hasLeaveApproval = hasSubModule(19);

    const overttimeItems = [
        {
            submoduleId: 20,
            name: "Apply RARO",
            href: route("myovertime.index"),
            active: route().current("myovertime.index"),
        },
        {
            submoduleId: 21,
            name: "RARO Approval",
            href: route("employeeovertime.index"),
            active: route().current("employeeovertime.index"),
            count: totalRaroPending,
        },
        {
            submoduleId: 23,
            name: "ARO Approval",
            href: route("employeeovertimeccomplishment.index"),
            active: route().current("employeeovertimeccomplishment.index"),
            count: totalAroPending,
        },
    ];

    const filteredOvertimeItems = overttimeItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const hasOvertimeApproval = hasSubModule(21) || hasSubModule(23);

    const tkoItems = [
        {
            submoduleId: 32,
            name: "Request TKO",
            href: route("mytko.index"),
            active: route().current("mytko.index"),
        },
        {
            submoduleId: 33,
            name: "TKO Approval",
            href: route("tko.index"),
            active: route().current("tko.index"),
            count: totalTkoPending,
        },
    ];

    const filterTkoItems = tkoItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const hasTkoApproval = hasSubModule(23);

    const downloadableForms = [
        {
            submoduleId: 7,
            name: "Form Type",
            href: route("typeform.index"),
            active: route().current("typeform.index"),
        },
        {
            submoduleId: 8,
            name: "Form Download",
            href: route("downloadform.index"),
            active: route().current("downloadform.index"),
        },
    ];

    const filteredDownloadableForms = downloadableForms.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const isEmployeeActive = employeeItems.some((item) => item.active);
    const isOvertimeActive = overttimeItems.some((item) => item.active);
    const isDownloadableActive = downloadableForms.some((item) => item.active);
    const isTkoActive = tkoItems.some((item) => item.active);

    const [employeeMenuOpen, setEmployeeMenuOpen] = useState(isEmployeeActive);
    const [overtimeMenuOpen, setOvertimeMenuOpen] = useState(isOvertimeActive);
    const [downloadbleMenuOpen, setDownloadableMenuOpen] =
        useState(isDownloadableActive);
    const [tkoMenuOpen, setTkoMenuOpen] = useState(isTkoActive);

    const allModules = [
        ...navItems,
        ...employeeItems,
        ...overttimeItems,
        ...downloadableForms,
        ...tkoItems,
    ];

    // CREATE A FILTERED LIST FOR SEARCH
    const filteredModulesForSearch = [
        // MODULES
        ...navItems
            .filter((item) => userModules.includes(item.moduleId))
            .map((item) => ({
                type: "module",
                id: item.moduleId,
                name: item.name,
                href: item.href,
            })),

        // SUBMODULES (Employee)
        ...employeeItems
            .filter((item) => userSubmodules.includes(item.submoduleId))
            .map((item) => ({
                type: "submodule",
                id: item.submoduleId,
                name: item.name,
                href: item.href,
            })),

        // SUBMODULES (Downloadable)
        ...downloadableForms
            .filter((item) => userSubmodules.includes(item.submoduleId))
            .map((item) => ({
                type: "submodule",
                id: item.submoduleId,
                name: item.name,
                href: item.href,
            })),
    ];

    function handleLogout() {
        post(route("logout"));
    }

    const confirmLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            handleLogout();
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-[#0A3D62] text-gray-200 w-60 shadow-xl">
            {/* Logo Section */}
            <div className="flex items-center justify-center py-6 border-b border-blue-900">
                <span className="text-lg font-bold text-white tracking-wide">
                    Welcome,{" "}
                    <span className="text-emerald-500">
                        {user?.employee_by?.lastname},{" "}
                        {user?.employee_by?.firstname
                            ?.split(" ")
                            .map((n) => n.charAt(0).toUpperCase())
                            .join("")}
                    </span>
                </span>
            </div>
            <button
                onClick={() => setCommandOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-white border border-blue-600/30 transition"
            >
                <Search className="w-4 h-4" />
                <span className="text-sm opacity-80">Search modules…</span>
            </button>

            <SidebarSearch
                allModules={filteredModulesForSearch}
                commandOpen={commandOpen}
                setCommandOpen={setCommandOpen}
            />

            {/* Main Navigation */}
            <nav className="flex-1 mt-6 px-3 space-y-1">
                {filteredNavItems.map((item) => {
                    const isActive = route().current(item.href) || item.active;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                                isActive
                                    ? "bg-blue-700 text-white shadow-md"
                                    : "hover:bg-blue-900 hover:text-white"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}

                {/* Overtime Settings Dropdown */}
                {hasModule(17) && (
                    <div>
                        <button
                            onClick={() =>
                                setOvertimeMenuOpen(!overtimeMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FcOvertime size={18} /> Overtime
                                {hasOvertimeApproval && (
                                    <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                        {totalApprovalPending}
                                    </span>
                                )}
                            </span>
                            {overtimeMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {overtimeMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredOvertimeItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-blue-950"
            }`}
                                        >
                                            <span>{sub.name}</span>

                                            {/* 🔔 Notification Badge */}
                                            {sub.count !== undefined && (
                                                <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                                    {Number(sub.count ?? 0)}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TKO Settings Dropdown */}
                {hasModule(20) && (
                    <div>
                        <button
                            onClick={() => setTkoMenuOpen(!tkoMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FcOvertime size={18} /> TKO
                                {hasTkoApproval && (
                                    <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                        {totalTkoPending}
                                    </span>
                                )}
                            </span>
                            {tkoMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {tkoMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filterTkoItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-blue-950"
            }`}
                                        >
                                            <span>{sub.name}</span>

                                            {/* 🔔 Notification Badge */}
                                            {sub.count !== undefined && (
                                                <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                                    {Number(sub.count ?? 0)}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Leave Settings Dropdown */}
                {hasModule(8) && (
                    <div>
                        <button
                            onClick={() =>
                                setEmployeeMenuOpen(!employeeMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FcLeave size={18} /> Leave
                                {hasLeaveApproval && (
                                    <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                        {totalLeavePending}
                                    </span>
                                )}
                            </span>
                            {employeeMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {employeeMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredEmployeeItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-blue-950"
            }`}
                                        >
                                            <span>{sub.name}</span>

                                            {/* 🔔 Notification Badge */}
                                            {sub.count !== undefined && (
                                                <span className="ml-2 flex items-center justify-center w-5 h-5 text-[0.65rem] font-bold text-white bg-red-500 rounded-full">
                                                    {Number(sub.count ?? 0)}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Downloadble Settings Dropdown */}
                {hasModule(10) && (
                    <div>
                        <button
                            onClick={() =>
                                setDownloadableMenuOpen(!downloadbleMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FaFileDownload size={18} /> Downloadble Forms
                            </span>
                            {downloadbleMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {downloadbleMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredDownloadableForms.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;
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
                )}
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
                        <div className="mt-4 border-t pt-3">
                            <Link
                                href={route("profile.edit")}
                                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                            >
                                Change Password
                            </Link>
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

export default SidebarGuest;
