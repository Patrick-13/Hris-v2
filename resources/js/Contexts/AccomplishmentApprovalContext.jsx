import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AccomplishmentContext = createContext(null);

export const AccomplishmentProvider = ({ user, children }) => {
    const [pendingAroCount, setPendingAroCount] = useState({
        "section/unit": 0,
        division: 0,
        rd: 0,
    });

    const fetchPending = async () => {
        try {
            const res = await axios.get("/user/overtime/pending/aro", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPendingAroCount(res.data.pendingAroCount);
        } catch (err) {
            console.error("Failed to fetch ARO pending:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPending();
        }
    }, [user]);

    return (
        <AccomplishmentContext.Provider
            value={{ pendingAroCount, fetchPending }}
        >
            {children}
        </AccomplishmentContext.Provider>
    );
};

export const useAccomplishmentNotifications = () => {
    const context = useContext(AccomplishmentContext);

    if (!context) {
        throw new Error(
            "useAccomplishmentNotifications must be used inside AccomplishmentProvider",
        );
    }

    return context;
};
