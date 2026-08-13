import { Timer, Clock } from "lucide-react";

const DtrCard = ({ dtr }) => {
    return (
        <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Timer className="text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        Latest Punch In
                    </h3>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                {dtr.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        ⏱ No punch-in records today
                    </div>
                ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {dtr.map((item, index) => {
                            const initials = `${
                                item.employee_transaction?.first_name?.[0] ?? ""
                            }${
                                item.employee_transaction?.last_name?.[0] ?? ""
                            }`;

                            return (
                                <li
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                                >
                                    {/* Left: Avatar + Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                            {initials}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {
                                                    item.employee_transaction
                                                        ?.first_name
                                                }{" "}
                                                {
                                                    item.employee_transaction
                                                        ?.last_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Time */}
                                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                                        <Clock className="h-4 w-4" />
                                        {new Date(
                                            item.punch_time
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
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

export default DtrCard;
