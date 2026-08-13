import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function AnniversaryModal({ employees, onClose }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (employees?.length > 0) {
            setShow(true);
        }
    }, [employees]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <Confetti numberOfPieces={300} />

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-pink-500">
                    🎉 Happy Anniversary!
                </h1>

                <div className="mt-4 space-y-2">
                    {employees.map((emp) => (
                        <p key={emp.employee_id} className="text-lg">
                          {emp.firstname} {emp.lastname}
                        </p>
                    ))}
                </div>

                <button
                    onClick={() => setShow(false)}
                    className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
