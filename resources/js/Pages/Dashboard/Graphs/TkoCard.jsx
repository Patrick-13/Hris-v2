import { TimerOff } from "lucide-react";

const TkoCard = ({ tkos }) => {
    console.log(tkos);
    return (
        <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b">
                <TimerOff className="text-green-500" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Timekeeping Offense Summary
                </h3>
            </div>

            {/* Body */}
            <div className="p-4">
                {tkos.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 py-8">
                        ⏱ No TKO records found
                    </div>
                ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {tkos.map((item) => {
                            const first = item.employee_by?.firstname ?? "";
                            const last = item.employee_by?.lastname ?? "";
                            const initials = `${first[0] ?? ""}${last[0] ?? ""}`;

                            return (
                                <li
                                    key={item.employee_id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                                >
                                    {/* LEFT: Employee */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                                            {initials}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {first} {last}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT: COUNT */}
                                    <div className="text-right">
                                        <div
                                            className={`text-lg font-bold ${
                                                item.tko_count >= 3
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {item.tko_count}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            TKO Count
                                        </div>
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

export default TkoCard;
