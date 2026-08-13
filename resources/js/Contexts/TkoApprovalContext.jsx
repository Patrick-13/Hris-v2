import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TkoContext = createContext(null);

export const TkoProvider = ({ user, children }) => {
    const [pendingTkoCount, setPendingTkoCount] = useState({
        section: 0,
        division: 0,
        hr: 0,
    });

    const [pendingTkoAdminCount, setPendingTkoAdminCount] = useState({
        section: 0,
        division: 0,
        hr: 0,
    });

    const fetchPending = () => {
        axios
            .get("/user/tko/pending", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setPendingTkoCount(res.data.pendingCount))
            .catch((err) => console.error(err));
    };

    const fetchAdminPending = async () => {
        try {
            const res = await axios.get("/admin/tko/view/pending");
            setPendingTkoAdminCount(res.data.pendingCount);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPending();

            if (user.role === "admin") {
                fetchAdminPending();
            }
        }
    }, [user]);

    return (
        <TkoContext.Provider
            value={{
                pendingTkoCount,
                pendingTkoAdminCount,
                fetchPending,
                fetchAdminPending,
            }}
        >
            {children}
        </TkoContext.Provider>
    );
};

export const useTkoNotifications = () => {
    const context = useContext(TkoContext);

    if (!context) {
        throw new Error(
            "use Tko Notifications must be used inside TkoProvider",
        );
    }

    return context;
};
