import React from "react";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { TrendingUp } from "lucide-react";

const LeaveBalance = ({ leaveCards }) => {
    const now = new Date();
    const year = now.getFullYear();

    // First month of the year
    const startMonth = new Date(year, 0, 1).toLocaleString("default", {
        month: "long",
    });

    const endMonth = now.toLocaleString("default", {
        month: "long",
    });

    const displayRange = `${startMonth} - ${endMonth} ${year}`;

    return (
        <div>
            <Card className="p-6 space-y-6">
                {/* HEADER - stays at top left */}
                <CardHeader className="p-0">
                    <CardTitle>Leave Credit Balance</CardTitle>
                    <CardDescription>{displayRange}</CardDescription>
                </CardHeader>

                {/* GRID OF LEAVE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leaveCards.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition duration-300"
                            style={{
                                backgroundColor: item.bgColor,
                            }}
                        >
                            {item.icon}
                            <span className="text-white text-sm">
                                {item.title}
                            </span>
                            <h2 className="text-3xl font-bold mt-2 text-white">
                                {item.value}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <CardFooter className="p-0">
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Trending up by 5.2% this month{" "}
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                {displayRange}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LeaveBalance;
