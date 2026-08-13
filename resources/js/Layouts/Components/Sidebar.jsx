import { Link, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
    MdDashboard,
    MdLogout,
    MdModelTraining,
    MdOutlineInventory,
    MdOutlinePayments,
} from "react-icons/md";
import { FaClipboardCheck, FaFileDownload, FaSitemap } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";
import { CiSettings, CiTimer } from "react-icons/ci";
import { IoChevronDown, IoChevronUp, IoTimer } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { FcLeave } from "react-icons/fc";
import { Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import SidebarSearch from "./Sidebar/SidebarSearch";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const Sidebar = ({ user, totalPending }) => {
    const { url } = usePage();
    const { post } = useForm();
    const [commandOpen, setCommandOpen] = useState(false);
    const [userModules, setUserModules] = useState([]);
    const [userSubmodules, setUserSubmodules] = useState([]);

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
            href: route("admindashboard"),
            active: route().current("admindashboard"),
            icon: <MdDashboard />,
        },

        {
            moduleId: 4,
            name: "DTR",
            href: route("dtr.index"),
            active: route().current("dtr.index"),
            icon: <CiTimer />,
        },

        {
            moduleId: 15,
            name: "Iclock Transaction",
            href: route("iclocktransaction.index"),
            active: route().current("iclocktransaction.index"),
            icon: <CiTimer />,
        },
    ];

    const filteredNavItems = navItems.filter((item) =>
        hasModule(item.moduleId)
    );

    const OvertimeItems = [
        {
            submoduleId: 21,
            name: "COC Credits",
            href: route("coccredit.index"),
            active: route().current("coccredit.index"),
        },
    ];

    const filteredOvertimeItems = OvertimeItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const DtrItems = [
        {
            submoduleId: 25,
            name: "Dtr / Attendance",
            href: route("iclocktransaction.index"),
            active: route().current("iclocktransaction.index"),
        },
        {
            submoduleId: 24,
            name: "Attendance Summary",
            href: route("dtr.index"),
            active: route().current("dtr.index"),
        },
        {
            submoduleId: 37,
            name: "Training",
            href: route("training.index"),
            active: route().current("training.index"),
            icon: <MdModelTraining />,
        },
        {
            submoduleId: 38,
            name: "Activity",
            href: route("activity.index"),
            active: route().current("activity.index"),
            icon: <FiActivity />,
        },
        {
            submoduleId: 39,
            name: "Timekeeping Offense",
            href: route("admintko.index"),
            active: route().current("admintko.index"),
            icon: <CiTimer />,
        },
        {
            submoduleId: 40,
            name: "RARO",
            href: route("raro.index"),
            active: route().current("raro.index"),
        },
        {
            submoduleId: 41,
            name: "ARO",
            href: route("aro.index"),
            active: route().current("aro.index"),
        },
    ];

    const filteredDtrItems = DtrItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const PayrollItems = [
        {
            submoduleId: 29,
            name: "Payroll",
            href: route("payroll.index"),
            active: route().current("payroll.index"),
        },
        {
            submoduleId: 28,
            name: "Deductions",
            href: route("deduction.index"),
            active: route().current("deduction.index"),
        },
    ];

    const filteredPayrollItems = PayrollItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const InventoryItems = [
        {
            submoduleId: 1,
            name: "Inventory Items",
            href: route("device.index"),
            active: route().current("device.index"),
        },
        {
            submoduleId: 2,
            name: "Inventory Assignment",
            href: route("device-assignment.index"),
            active: route().current("device-assignment.index"),
        },
    ];

    const filteredInventoryItems = InventoryItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const employeeItems = [
        {
            submoduleId: 36,
            name: "Org Chart",
            href: route("orgchart.index"),
            active: route().current("orgchart.index"),
            icon: <FaSitemap />,
        },
        {
            submoduleId: 3,
            name: "Employee List",
            href: route("employee.index"),
            active: route().current("employee.index"),
        },
        {
            submoduleId: 4,
            name: "Movements",
            href: route("employeemovement.index"),
            active: route().current("employeemovement.index"),
        },
        {
            submoduleId: 12,
            name: "Division",
            href: route("division.index"),
            active: route().current("division.index"),
        },
        {
            submoduleId: 13,
            name: "Section",
            href: route("section.index"),
            active: route().current("section.index"),
        },

        {
            submoduleId: 14,
            name: "Position",
            href: route("position.index"),
            active: route().current("position.index"),
        },
    ];

    const filteredEmployeeItems = employeeItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const LeaveItems = [
        {
            submoduleId: 5,
            name: "Leave Credits",
            href: route("leavecredit.index"),
            active: route().current("leavecredit.index"),
        },
        {
            submoduleId: 6,
            name: "Leave Status",
            href: route("employeeleaveadmin.index"),
            active: route().current("employeeleaveadmin.index"),
        },
    ];

    const filteredLeaveItems = LeaveItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const systemItems = [
        {
            submoduleId: 9,
            name: "Activity Type",
            href: route("activitytype.index"),
            active: route().current("activitytype.index"),
        },
        {
            submoduleId: 10,
            name: "Company",
            href: route("company.index"),
            active: route().current("company.index"),
        },
        {
            submoduleId: 35,
            name: "Office",
            href: route("office.index"),
            active: route().current("office.index"),
        },
        {
            submoduleId: 11,
            name: "Category",
            href: route("category.index"),
            active: route().current("category.index"),
        },
        {
            submoduleId: 27,
            name: "Holidays",
            href: route("holiday.index"),
            active: route().current("holiday.index"),
        },

        {
            submoduleId: 15,
            name: "Leave Type",
            href: route("leavetype.index"),
            active: route().current("leavetype.index"),
        },
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
            submoduleId: 30,
            name: "Button",
            href: route("button.index"),
            active: route().current("button.index"),
        },
        {
            submoduleId: 31,
            name: "Memos",
            href: route("memo.index"),
            active: route().current("memo.index"),
        },
        {
            submoduleId: 34,
            name: "Leave Credit Logs",
            href: route("leavecreditlog.index"),
            active: route().current("leavecreditlog.index"),
        },
        {
            submoduleId: 18,
            name: "User Access",
            href: route("usermodule.index"),
            active: route().current("usermodule.index"),
        },
        {
            submoduleId: 26,
            name: "User Logs",
            href: route("userloginlog.index"),
            active: route().current("userloginlog.index"),
        },
    ];

    const filteredSystemItems = systemItems.filter((item) =>
        hasSubModule(item.submoduleId)
    );

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
            href: route("downloadformadmin.index"),
            active: route().current("downloadformadmin.index"),
        },
    ];

    const filteredDownloadableForms = downloadableForms.filter((item) =>
        hasSubModule(item.submoduleId)
    );

    const allModules = [
        ...navItems,
        ...OvertimeItems,
        ...DtrItems,
        ...PayrollItems,
        ...InventoryItems,
        ...employeeItems,
        ...LeaveItems,
        ...systemItems,
        ...downloadableForms,
    ];

    const isEmployeeActive = employeeItems.some((item) => item.active);
    const isOvertimeActive = OvertimeItems.some((item) => item.active);
    const isDtrActive = DtrItems.some((item) => item.active);
    const isPayrollActive = PayrollItems.some((item) => item.active);
    const isInventoryActive = InventoryItems.some((item) => item.active);
    const isLeaveActive = LeaveItems.some((item) => item.active);
    const isSystemActive = systemItems.some((item) => item.active);
    const isDownloadableActive = downloadableForms.some((item) => item.active);

    const [employeeMenuOpen, setEmployeeMenuOpen] = useState(isEmployeeActive);
    const [inventoryMenuOpen, setInventoryMenuOpen] =
        useState(isInventoryActive);
    const [dtrMenuOpen, setDtrMenuOpen] = useState(isDtrActive);
    const [payrollMenuOpen, setPayrollMenuOpen] = useState(isPayrollActive);
    const [overtimeMenuOpen, setOvertimeMenuOpen] = useState(isOvertimeActive);
    const [leaveMenuOpen, setLeaveMenuOpen] = useState(isLeaveActive);
    const [systemMenuOpen, setSystemMenuOpen] = useState(isSystemActive);

    const [downloadbleMenuOpen, setDownloadableMenuOpen] =
        useState(isDownloadableActive);

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
            <button
                onClick={() => setCommandOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-white border border-blue-600/30 transition"
            >
                <Search className="w-4 h-4" />
                <span className="text-sm opacity-80">Search modules…</span>
            </button>

            <SidebarSearch
                allModules={allModules}
                commandOpen={commandOpen}
                setCommandOpen={setCommandOpen}
            />

            {/* Main Navigation */}
            <nav className="flex-1 mt-4 px-3 space-y-1">
                {filteredNavItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-800 ${
                            item.active
                                ? "bg-blue-900 text-white"
                                : "text-gray-300"
                        }`}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}

                {/* Employee Settings Dropdown */}
                {hasModule(7) && (
                    <div>
                        <button
                            onClick={() =>
                                setEmployeeMenuOpen(!employeeMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <GrUserSettings size={18} /> Employees
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
                                    const showBadge =
                                        sub.name === "Leave Status" &&
                                        totalPending > 0; // ✅ Show badge for Leave Status only

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>

                                            {/* 🔔 Notification Badge */}
                                            {showBadge && (
                                                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                    {totalPending > 0
                                                        ? totalPending
                                                        : 0}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Overtime Settings Dropdown */}
                {/* {hasModule(17) && (
                    <div>
                        <button
                            onClick={() =>
                                setOvertimeMenuOpen(!overtimeMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <IoTimer size={18} /> Overtime
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
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )} */}

                {/* Dtr Settings Dropdown */}
                {hasModule(16) && (
                    <div>
                        <button
                            onClick={() => setDtrMenuOpen(!dtrMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FaClipboardCheck size={18} /> Time & Attendance
                            </span>
                            {dtrMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {dtrMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredDtrItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Payroll Settings Dropdown */}
                {hasModule(18) && (
                    <div>
                        <button
                            onClick={() => setPayrollMenuOpen(!payrollMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <MdOutlinePayments size={18} /> Payroll
                            </span>
                            {payrollMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {payrollMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredPayrollItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>
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
                            onClick={() => setLeaveMenuOpen(!leaveMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <FcLeave size={18} className="text-gray-400" />{" "}
                                Leave
                            </span>
                            {leaveMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {leaveMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredLeaveItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;
                                    const showBadge =
                                        sub.name === "Leave Status" &&
                                        totalPending > 0; // ✅ Show badge for Leave Status only

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                {/* Inventory Settings Dropdown */}
                {hasModule(6) && (
                    <div>
                        <button
                            onClick={() =>
                                setInventoryMenuOpen(!inventoryMenuOpen)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-blue-900 transition-all duration-200"
                        >
                            <span className="flex items-center gap-3">
                                <MdOutlineInventory size={18} /> Inventory
                            </span>
                            {inventoryMenuOpen ? (
                                <IoChevronUp size={16} />
                            ) : (
                                <IoChevronDown size={16} />
                            )}
                        </button>

                        {inventoryMenuOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                                {filteredInventoryItems.map((sub) => {
                                    const isActive =
                                        url === sub.href || sub.active;
                                    const showBadge =
                                        sub.name === "Leave Status" &&
                                        totalPending > 0; // ✅ Show badge for Leave Status only

                                    return (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm transition-all duration-200 
            ${
                isActive
                    ? "bg-blue-700 text-white w-64"
                    : "text-gray-400 hover:text-white hover:bg-blue-950 w-64"
            }`}
                                        >
                                            <span>{sub.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                {/* System Settings Dropdown */}
                {hasModule(9) && (
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
                                {filteredSystemItems.map((sub) => {
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

export default Sidebar;
