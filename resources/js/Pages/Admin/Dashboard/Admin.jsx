"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import AttendanceChart from "./Graphs/AttendanceChart";
import GenderChart from "./Graphs/GenderChart";
import BirthdayCard from "./Graphs/BirthdayCard";
import months from "@/Utils/months";
import TileCard from "./Graphs/TileCard";
import DtrCard from "./Graphs/DtrCard";
import LeaveTodayTable from "./Graphs/LeaveTodayTable";

// Predefined Theme Options
const themeOptions = {
    Blue: { desktop: "#2563eb", mobile: "#60a5fa" },
    Green: { desktop: "#16a34a", mobile: "#4ade80" },
    Red: { desktop: "#dc2626", mobile: "#f87171" },
    Purple: { desktop: "#7c3aed", mobile: "#c084fc" },
};

export default function Admin({
    employeecount,
    employeesOnLeaveToday,
    leavecount,
    present,
    late,
    absent,
    attendanceTrend,
    male,
    female,
    birthday,
    selectedMonth,
    dtr,
}) {
    const [chartTheme, setChartTheme] = useState(themeOptions.Blue);

    const attendanceChartTheme = {
        late: "#f59e0b",
        leave: "#3b82f6",
        absent: "#ef4444",
    };

    const genderData = [
        { name: "Male", value: male },
        { name: "Female", value: female },
    ];

    const monthName = months[selectedMonth - 1];

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
                <div>
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
                    <TileCard
                        employeecount={employeecount}
                        leavecount={leavecount}
                        present={present}
                        late={late}
                        absent={absent}
                        chartTheme={chartTheme}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                        <AttendanceChart
                            chartTheme={attendanceChartTheme}
                            data={attendanceTrend}
                        />
                        <GenderChart data={genderData} />

                        <BirthdayCard
                            birthdays={birthday}
                            monthName={monthName}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-2">
                        <div className="lg:col-span-2">
                            {" "}
                            <LeaveTodayTable
                                employeeOnLeave={employeesOnLeaveToday}
                            />
                        </div>

                        <DtrCard dtr={dtr} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
