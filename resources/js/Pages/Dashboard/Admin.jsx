"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    FaCalendarCheck,
    FaUmbrellaBeach,
    FaUsers,
    FaUserTimes,
} from "react-icons/fa";

import { useState } from "react";
import AttendanceChart from "./Graphs/AttendanceChart";

// Predefined Theme Options
const themeOptions = {
    Blue: { desktop: "#2563eb", mobile: "#60a5fa" },
    Green: { desktop: "#16a34a", mobile: "#4ade80" },
    Red: { desktop: "#dc2626", mobile: "#f87171" },
    Purple: { desktop: "#7c3aed", mobile: "#c084fc" },
};

export default function Admin({ employeecount, leavecount, attendanceTrend }) {
    const [chartTheme, setChartTheme] = useState(themeOptions.Blue);
    // Stats Cards
    const stats = [
        {
            id: 1,
            title: "Total Employees",
            value: employeecount,
            icon: <FaUsers className="text-4xl mb-2 text-white" />,
        },
        {
            id: 2,
            title: "Present Today",
            value: 98,
            icon: <FaCalendarCheck className="text-4xl mb-2 text-white" />,
        },
        {
            id: 3,
            title: "On Leave",
            value: leavecount,
            icon: <FaUmbrellaBeach className="text-4xl mb-2 text-white" />,
        },
        {
            id: 4,
            title: "Absent",
            value: 17,
            icon: <FaUserTimes className="text-4xl mb-2 text-white" />,
        },
    ];

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
                                themeOptions[k].desktop === chartTheme.desktop
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {stats.map((item, index) => {
                            // First two cards use desktop color, last two use mobile color
                            const bgColor =
                                index < 2
                                    ? chartTheme.desktop
                                    : chartTheme.mobile;
                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition duration-300"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {item.icon}
                                    <span className="text-white text-sm">
                                        {item.title}
                                    </span>
                                    <h2 className="text-3xl font-bold mt-2 text-white">
                                        {item.value}
                                    </h2>
                                </div>
                            );
                        })}

                        <AttendanceChart
                            chartTheme={chartTheme}
                            data={attendanceTrend}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
