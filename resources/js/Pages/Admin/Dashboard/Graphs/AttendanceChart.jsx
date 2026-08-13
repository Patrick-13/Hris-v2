import React from "react";

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/Components/ui/card";
import { TrendingUp } from "lucide-react";

// Chart Data

const AttendanceChart = ({ chartTheme, data }) => {
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

    const trend = (() => {
        if (!data || data.length < 2) return null;

        const last = data[data.length - 1];
        const prev = data[data.length - 2];

        const lastTotal = last.late + last.leave + last.absent;
        const prevTotal = prev.late + prev.leave + prev.absent;

        if (prevTotal === 0) return null;

        return (((lastTotal - prevTotal) / prevTotal) * 100).toFixed(1);
    })();

    const isTrendingUp = trend !== null && trend > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Attendance</CardTitle>
                <CardDescription>{displayRange}</CardDescription>
            </CardHeader>
            <ChartContainer
                config={{
                    late: chartTheme.late,
                    leave: chartTheme.leave,
                    absent: chartTheme.absent,
                }}
                className="min-h-[320px] w-full px-4 pb-4"
            >
                <LineChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />

                    <Line
                        type="monotone"
                        dataKey="late"
                        stroke={chartTheme.late}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="leave"
                        stroke={chartTheme.leave}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="absent"
                        stroke={chartTheme.absent}
                        strokeWidth={2}
                    />
                </LineChart>
            </ChartContainer>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        {trend !== null && (
                            <div
                                className={`flex items-center gap-2 leading-none font-medium ${
                                    isTrendingUp
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isTrendingUp ? "Trending up" : "Trending down"}{" "}
                                by {Math.abs(trend)}%
                                <TrendingUp
                                    className={`h-4 w-4 ${
                                        !isTrendingUp && "rotate-180"
                                    }`}
                                />
                            </div>
                        )}

                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            {displayRange}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AttendanceChart;
