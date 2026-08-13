"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LeaveBalance from "./Graphs/LeaveBalance";
import DtrCard from "./Graphs/DtrCard";
import ComingSoonCard from "./Graphs/ComingSoonCard";
import {
    FaUmbrellaBeach,
    FaUserInjured,
    FaGift,
    FaUsers,
    FaBuilding,
    FaRegCalendarAlt,
} from "react-icons/fa";
import BirthdayModal from "@/Components/BirthdayModal";
import AnniversaryModal from "@/Components/AnniversaryModal";
import DataPrivacy from "@/Components/DataPrivacy";
import DataPrivacyCard from "./Graphs/DataPrivacyCard";
import TkoCard from "./Graphs/TkoCard";

const getIcon = (name) => {
    if (name.includes("Vacation"))
        return <FaUmbrellaBeach className="text-white text-xl" />;
    if (name.includes("Sick"))
        return <FaUserInjured className="text-white text-xl" />;
    if (name.includes("Privilege"))
        return <FaGift className="text-white text-xl" />;
    if (name.includes("Parental"))
        return <FaUsers className="text-white text-xl" />;
    if (name.includes("Mandatory"))
        return <FaBuilding className="text-white text-xl" />;

    return <FaRegCalendarAlt className="text-white text-xl" />;
};

export default function User({
    leavecredits,
    dtrs,
    birthdayEmployees,
    anniverysaryEmployees,
    privacyAccepted,
    tkos,
}) {
    // const [chartTheme, setChartTheme] = useState(themeOptions.Blue);
    const [queue, setQueue] = useState([]);
    const [activeModal, setActiveModal] = useState(null);

    // Build queue
    useEffect(() => {
        let q = [];
        if (birthdayEmployees?.length > 0) q.push("birthday");
        if (anniverysaryEmployees?.length > 0) q.push("anniversary");
        setQueue(q);
    }, [birthdayEmployees, anniverysaryEmployees]);

    // Show first modal
    useEffect(() => {
        if (queue.length > 0 && !activeModal) {
            setActiveModal(queue[0]);
        }
    }, [queue, activeModal]);

    // Auto close and move to next
    useEffect(() => {
        if (activeModal) {
            const timer = setTimeout(() => {
                setQueue((prev) => prev.slice(1));
                setActiveModal(null);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [activeModal]);

    // Stats Cards
    const leaveCards = Array.isArray(leavecredits)
        ? leavecredits
              .filter(
                  (credit) =>
                      Number(credit.balance) > 0 && Number(credit.entitled) > 0,
              )
              .map((credit) => {
                  const getColor = (name) => {
                      if (name.includes("Vacation")) return "#22c55e";
                      if (name.includes("Sick")) return "#ef4444";
                      if (name.includes("Privilege")) return "#3b82f6";
                      return "#6366f1";
                  };

                  return {
                      id: credit.leave_type_id,
                      title: credit.leave_type_name,
                      value: Number(credit.balance),
                      entitled: Number(credit.entitled), // ✅ FIX HERE
                      icon: getIcon(credit.leave_type_name),
                      bgColor: getColor(credit.leave_type_name),
                  };
              })
        : [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Stats Cards & Chart */}
            <div className="py-2 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
                    <DataPrivacy privacyAccepted={privacyAccepted} />
                    <LeaveBalance leaveCards={leaveCards} />
                    {activeModal === "birthday" && (
                        <BirthdayModal employees={birthdayEmployees} />
                    )}

                    {activeModal === "anniversary" && (
                        <AnniversaryModal employees={anniverysaryEmployees} />
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-2">
                        <DtrCard dtr={dtrs} />
                        <DataPrivacyCard privacyAccepted={privacyAccepted} />
                        <TkoCard tkos={tkos} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
