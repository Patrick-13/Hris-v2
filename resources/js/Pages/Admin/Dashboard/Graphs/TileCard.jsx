import React from "react";
import {
    FaCalendarCheck,
    FaUmbrellaBeach,
    FaUsers,
    FaUserTimes,
} from "react-icons/fa";
const TileCard = ({
    employeecount,
    leavecount,
    present,
    late,
    absent,
    chartTheme,
}) => {
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
            value: present,
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
            value: absent,
            icon: <FaUserTimes className="text-4xl mb-2 text-white" />,
        },
        {
            id: 5,
            title: "Late",
            value: late,
            icon: <FaUserTimes className="text-4xl mb-2 text-white" />,
        },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-3">
            {stats.map((item, index) => {
                const bgColor =
                    index < 2 ? chartTheme.desktop : chartTheme.mobile;

                return (
                    <div
                        key={item.id}
                        className="rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex justify-between items-center">
                            {/* Left: Text */}
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">
                                    {item.title}
                                </span>
                                <h2 className="text-3xl font-bold mt-1 text-white">
                                    {item.value}
                                </h2>
                            </div>

                            {/* Right: Icon */}
                            <div className="text-white text-4xl">
                                {item.icon}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TileCard;
