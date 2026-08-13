import { Cake, Calendar } from "lucide-react";
import { router } from "@inertiajs/react";
import months from "@/Utils/months";

const BirthdayCard = ({ birthdays, selectedMonth }) => {
    const todayMonth = new Date().getMonth() + 1;
    const activeMonth = selectedMonth ?? todayMonth;
    const monthName = months[activeMonth - 1];

    return (
        <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Cake className="text-pink-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        Birthdays · {monthName}
                    </h3>
                </div>

                {/* Month Selector */}
                <select
                    value={activeMonth}
                    onChange={(e) =>
                        router.get(
                            route("admindashboard"),
                            { month: e.target.value },
                            {
                                preserveState: true,
                                replace: true,
                            },
                        )
                    }
                    className="text-sm border w-36 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                    {months.map((m, i) => (
                        <option key={i} value={i + 1}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Body */}
            <div className="p-4">
                {birthdays.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        🎈 No birthdays this month
                    </div>
                ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {birthdays.map((emp) => {
                            const day = new Date(emp.date_of_birth).getDate();

                            const initials = `${emp.firstname?.[0] ?? ""}${
                                emp.lastname?.[0] ?? ""
                            }`;

                            return (
                                <li
                                    key={emp.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600 transition"
                                >
                                    {/* Left: Avatar + Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-semibold">
                                            {initials}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {emp.firstname} {emp.lastname}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Employee
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Date */}
                                    <div className="flex items-center gap-2 text-sm font-medium text-pink-600">
                                        <Calendar className="h-4 w-4" />
                                        {day}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BirthdayCard;
