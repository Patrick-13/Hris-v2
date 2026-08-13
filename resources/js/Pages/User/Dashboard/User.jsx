"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import AttendanceChart from "./Graphs/AttendanceChart";
import LeaveBalance from "./Graphs/LeaveBalance";
import {
    FaUmbrellaBeach,
    FaUserInjured,
    FaGift,
    FaUsers,
    FaBuilding,
    FaRegCalendarAlt,
} from "react-icons/fa";

const getIcon = (name) => {
    if (name.includes("Vacation"))
        return <FaUmbrellaBeach className="text-white text-xl" />;
    if (name.includes("Sick"))
        return <FaUserInjured className="text-white text-xl" />;
    if (name.includes("Privilege"))
        return <FaGift className="text-white text-xl" />;
    if (name.includes("Parental"))
        return <FaUsers className="text-white text-xl" />;
    if (name.includes("Mandatory"))
        return <FaBuilding className="text-white text-xl" />;

    return <FaRegCalendarAlt className="text-white text-xl" />;
};

// Predefined Theme Options
const themeOptions = {
    Blue: { desktop: "#2563eb", mobile: "#60a5fa" },
    Green: { desktop: "#16a34a", mobile: "#4ade80" },
    Red: { desktop: "#dc2626", mobile: "#f87171" },
    Purple: { desktop: "#7c3aed", mobile: "#c084fc" },
};

export default function User({ leavecredits }) {
    const [chartTheme, setChartTheme] = useState(themeOptions.Blue);

    // Stats Cards
    const leaveCards = Array.isArray(leavecredits)
        ? leavecredits
              .filter(
                  (credit) =>
                      Number(credit.balance) > 0 && Number(credit.entitled) > 0,
              )
              .map((credit, index) => {
                  const bgColor =
                      index % 2 === 0 ? chartTheme.desktop : chartTheme.mobile;

                  return {
                      id: credit.leave_type_id,
                      title: credit.leave_type_name,
                      value: Number(credit.balance),
                      icon: getIcon(credit.leave_type_name),
                      bgColor,
                  };
              })
        : [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Theme Dropdown */}
            <div className="px-4 py-2 flex items-center gap-3">
                <label className="font-medium whitespace-nowrap">
                    Select Theme:
                </label>
                <div className="relative">
                    <select
                        className="
        appearance-none 
        border border-gray-300 
        dark:border-gray-600 
        text-gray-800 dark:text-gray-200 
        bg-white dark:bg-gray-800 
        rounded px-4 py-1 pr-8 cursor-pointer
      "
                        value={Object.keys(themeOptions).find(
                            (k) =>
                                themeOptions[k].desktop === chartTheme.desktop,
                        )}
                        onChange={(e) =>
                            setChartTheme(themeOptions[e.target.value])
                        }
                    >
                        {Object.keys(themeOptions).map((theme) => (
                            <option key={theme} value={theme}>
                                {theme}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Stats Cards & Chart */}
            <div className="py-2 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
                    <LeaveBalance leaveCards={leaveCards} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-2">
                        <AttendanceChart chartTheme={chartTheme} />
                        <AttendanceChart chartTheme={chartTheme} />
                        <AttendanceChart chartTheme={chartTheme} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
