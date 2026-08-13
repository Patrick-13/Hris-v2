import { useEffect, useState } from "react";
import DtrModal from "./DtrModal";

export default function DtrButton({ label, type }) {
    const [open, setOpen] = useState(false);
    const [office, setOffice] = useState(null);

    // office location
    useEffect(() => {
        axios.get("/user/mydtr/geofence").then((response) => {
            console.log("Geofence Response:", response.data);
            setOffice(response.data);
        });
    }, []);

    // Determine color based on type
    let baseColor = "bg-gray-200 text-gray-800 hover:bg-gray-300"; // default
    if (type === "timeIn" || type === "breakIn") {
        baseColor = "bg-green-600 text-white hover:bg-green-700";
    } else if (type === "breakOut" || type === "timeOut") {
        baseColor = "bg-red-600 text-white hover:bg-red-700";
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`${baseColor} py-3 rounded-lg font-semibold w-56 transition`}
            >
                {label}
            </button>

            {open && (
                <DtrModal
                    office={office}
                    type={type}
                    label={label}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
