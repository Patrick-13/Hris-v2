import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const OvertimeContext = createContext(null);

export const OvertimeProvider = ({ user, children }) => {
    const [pendingCount, setPendingCount] = useState({
        "section/unit": 0,
        division: 0,
        rd: 0,
    });

    const fetchPending = () => {
        axios
            .get("/user/overtime/pending/raro", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setPendingCount(res.data.pendingCount))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        if (user) {
            fetchPending();
        }
    }, [user]);

    return (
        <OvertimeContext.Provider value={{ pendingCount, fetchPending }}>
            {children}
        </OvertimeContext.Provider>
    );
};

export const useOvertimeNotifications = () => {
    const context = useContext(OvertimeContext);

    if (!context) {
        throw new Error(
            "use Overtime Notifications must be used inside OvertimeProvider",
        );
    }

    return context;
};
