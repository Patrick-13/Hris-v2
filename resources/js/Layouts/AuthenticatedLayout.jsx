import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Header } from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import SidebarGuest from "./Components/SidebarGuest";
import { TkoProvider } from "@/Contexts/TkoApprovalContext";
import { OvertimeProvider } from "@/Contexts/OvertimeApprovalContext";
import { AccomplishmentProvider } from "@/Contexts/AccomplishmentApprovalContext";
import { NotificationProvider } from "@/Contexts/NotificationContext";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.message?.success) toast.success(flash.message.success);
        if (flash?.message?.error) toast.error(flash.message.error);
    }, [flash]);

    return (
        <OvertimeProvider user={user}>
            <AccomplishmentProvider user={user}>
                <TkoProvider user={user}>
                    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
                        <div className="flex flex-1 h-full">
                            {/* Sidebar */}
                            <aside className="hidden sm:flex w-60 bg-[#0A3D62] dark:bg-gray-900 text-white min-h-screen flex-col shadow-md">
                                {user.role == "admin" ? (
                                    <Sidebar
                                        user={user}
                                        sidebarOpen={sidebarOpen}
                                        setSidebarOpen={setSidebarOpen}
                                    />
                                ) : (
                                    <SidebarGuest
                                        user={user}
                                        sidebarOpen={sidebarOpen}
                                        setSidebarOpen={setSidebarOpen}
                                    />
                                )}
                            </aside>
                            {/* Content */}
                            <main className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                                {/* Header */}
                                <Header
                                    user={user}
                                    header={header}
                                    setSidebarOpen={setSidebarOpen}
                                />

                                {/* Main body */}
                                <div className="px-4">{children}</div>
                            </main>
                        </div>
                    </div>
                </TkoProvider>
            </AccomplishmentProvider>
        </OvertimeProvider>
    );
}
