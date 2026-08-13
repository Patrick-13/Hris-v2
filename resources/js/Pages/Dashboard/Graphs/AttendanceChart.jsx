import React from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

const AttendanceChart = ({ chartTheme }) => {
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
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Attendance</CardTitle>
                <CardDescription>{displayRange}</CardDescription>
            </CardHeader>
            <ChartContainer
                config={{
                    desktop: chartTheme.desktop,
                    mobile: chartTheme.mobile,
                }}
                className="min-h-[200px] w-full"
            >
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(v) => v.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey="desktop"
                        fill={chartTheme.desktop}
                        radius={4}
                    />
                    <Bar dataKey="mobile" fill={chartTheme.mobile} radius={4} />
                </BarChart>
            </ChartContainer>
            <CardFooter>
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
    );
};

export default AttendanceChart;
