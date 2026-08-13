import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
} from "@/Components/ui/card";

const COLORS = {
    Male: "#3b82f6", // blue
    Female: "#ec4899", // pink
};

const GenderChart = ({ data }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Total Employees: {total}</CardDescription>
            </CardHeader>

            <ChartContainer
                config={{
                    Male: COLORS.Male,
                    Female: COLORS.Female,
                }}
                className="min-h-[320px] w-full px-4 pb-4"
            >
                {/* ✅ ResponsiveContainer makes the chart fit the parent */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 pb-4 text-sm">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[item.name] }}
                        />
                        {item.name}: {item.value}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default GenderChart;
