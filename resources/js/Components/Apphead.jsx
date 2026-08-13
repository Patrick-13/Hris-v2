import React, { useEffect, useState } from "react";
import ApplicationLogo from "./ApplicationLogo"; // adjust path
import { useTheme } from "@/Contexts/ThemeContext"; // ✅ import theme context
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Apphead = () => {
    const [time, setTime] = useState(new Date());
    const { theme, toggleTheme } = useTheme(); // ✅ use theme context

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="flex flex-col sticky top-0 sm:flex-row sm:items-center sm:justify-between 
                px-4 sm:px-6 py-3 sm:py-4 
                bg-white dark:bg-gray-900 
                text-black dark:text-white 
                font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.1)] 
                border-b border-gray-200 dark:border-gray-700
                transition-colors duration-300 gap-3 sm:gap-0"
        >
            {/* Left section - Logo and Title */}
            <div className="flex items-center gap-3 min-w-0">
                <ApplicationLogo className="h-10 w-20 sm:h-14 sm:w-28 shrink-0" />
                {/* Adjust size here */}
                <div className="flex flex-col leading-tight min-w-0">
                    <span
                        className="text-sm sm:text-base font-bold 
                             text-gray-800 dark:text-gray-100 truncate"
                    >
                        DEMO HRIS
                    </span>

                    {/* Hide subtitle on mobile */}
                    <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-normal">
                        This system is for demo only
                    </span>
                </div>
            </div>

            {/* Right section - Notification + Theme Toggle + Time/Date */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                {/* 🔔 Notification Icon */}

                {/* 🌙 / ☀️ Theme Toggle Button */}
                <Button
                    onClick={toggleTheme}
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    {theme === "light" ? (
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                    ) : (
                        <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    )}
                </Button>
                {/* 🕒 Time and Date */}
                <div className="text-right leading-tight">
                    <div className="text-sm sm:text-xl font-bold text-blue-700 dark:text-blue-400">
                        {time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>

                    {/* Hide full date on mobile */}
                    <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                        {time.toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apphead;
