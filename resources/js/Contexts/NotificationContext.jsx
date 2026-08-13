import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ user, children }) => {
    const [pendingLeaveCount, setpendingLeaveCount] = useState({
        "unit/section chief": 0,
        "division chief": 0,
        finance: 0,
        rd: 0,
    });

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/user/notifications", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setpendingLeaveCount(res.data.pendingLeaveCount);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    return (
        <NotificationContext.Provider
            value={{ pendingLeaveCount, fetchNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useLeaveApprovalNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "use Leave Notifications must be used inside AccomplishmentProvider",
        );
    }

    return context;
};
