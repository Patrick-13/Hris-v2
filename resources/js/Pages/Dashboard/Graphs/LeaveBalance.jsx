import React from "react";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

const LeaveBalance = ({ leaveCards }) => {
    const filteredCards = leaveCards.filter((item) => Number(item.value) > 0);

    console.log(filteredCards);

    const now = new Date();
    const year = now.getFullYear();
    const lastProcessedMonth = 4;
    // First month of the year
    const startMonth = new Date(year, 0, 1).toLocaleString("default", {
        month: "long",
    });

    // const endMonth = now.toLocaleString("default", {
    //     month: "long",
    // });

    const endMonth = new Date(year, lastProcessedMonth, 1).toLocaleString(
        "default",
        {
            month: "long",
        },
    );

    const displayRange = `${startMonth} - ${endMonth} ${year}`;

    return (
        <div>
            <Card className="p-6 space-y-6">
                {/* HEADER - stays at top left */}
                <CardHeader className="p-0">
                    <CardTitle className="text-xl font-semibold">
                        Leave Credit Balance
                    </CardTitle>
                    <CardDescription>{displayRange}</CardDescription>
                </CardHeader>

                {/* GRID OF LEAVE CARDS */}
                {filteredCards.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        No available leave credits
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCards.map((item) => {
                            const used =
                                Number(item.entitled || 0) -
                                Number(item.value || 0);

                            const percent =
                                item.entitled > 0
                                    ? Math.round((used / item.entitled) * 100)
                                    : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl p-5 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition duration-300 border"
                                >
                                    {/* TOP */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{
                                                    backgroundColor:
                                                        item.bgColor,
                                                }}
                                            >
                                                {item.icon}
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-white text-sm">
                                                {item.title}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-500">
                                            {percent}% used
                                        </span>
                                    </div>

                                    {/* VALUE */}
                                    <div className="flex items-end justify-between">
                                        <h2 className="text-3xl font-bold text-emerald-500">
                                            {item.value}{" "}
                                            {[10].includes(Number(item.id))
                                                ? "hrs"
                                                : "days"}
                                        </h2>
                                        <span className="text-xs text-gray-500">
                                            of {item.entitled}{" "}
                                            {[10].includes(Number(item.id))
                                                ? "hrs"
                                                : "days"}
                                        </span>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${100 - percent}%`,
                                                backgroundColor: item.bgColor,
                                            }}
                                        ></div>
                                    </div>

                                    {/* FOOTER */}
                                    <div className="flex justify-between text-sm text-red-500 mt-2">
                                        <span>
                                            Used: {used}{" "}
                                            {[10].includes(Number(item.id))
                                                ? "hrs"
                                                : "days"}
                                        </span>
                                        <span className="text-gray-500">
                                            Remaining
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LeaveBalance;
