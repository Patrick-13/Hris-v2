import React, { useState } from "react";
import {
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

const DataPrivacyCard = ({ privacyAccepted }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAgree = async () => {
        try {
            setLoading(true);
            await axios.post("/privacy-consent");
            setShowModal(false);

            // better than reload (soft update if you want later via Inertia)
            window.location.reload();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center gap-2 px-5 py-4 border-b dark:border-gray-700">
                <FaShieldAlt className="text-blue-500 text-lg" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Data Privacy Act Compliance
                </h3>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-4">

                {/* STATUS BADGE */}
                {privacyAccepted ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg w-fit">
                        <FaCheckCircle />
                        <span>Accepted & Compliant</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg w-fit">
                        <FaExclamationTriangle />
                        <span>Pending Acceptance</span>
                    </div>
                )}

                {/* INFO TEXT */}
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                    <p>
                        Your information is used strictly for HRIS operations such as attendance,
                        payroll, and employee records management.
                    </p>

                    <p>
                        We ensure all data is protected under strict confidentiality and security
                        standards in compliance with the Data Privacy Act of 2012.
                    </p>
                </div>

                {/* ACTION */}
                <div className="flex justify-end pt-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View Privacy Notice
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">

                        <h2 className="text-xl font-bold mb-3">
                            Data Privacy Act of 2012
                        </h2>

                        <div className="max-h-64 overflow-y-auto text-sm text-gray-700 space-y-3 border p-3 rounded-lg bg-gray-50">
                            <p>
                                By continuing to use this Human Resource Management System V2,
                                you consent to the collection, processing, and storage of your personal information
                                under Republic Act No. 10173 (Data Privacy Act of 2012).
                            </p>

                            <p>
                                Your data will be used solely for official HRIS operations of DENR - EMB XI.
                            </p>

                            <p>
                                We ensure confidentiality, security, and compliance with NPC regulations.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                            >
                                Close
                            </button>

                            {!privacyAccepted && (
                                <button
                                    onClick={handleAgree}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "I Agree"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataPrivacyCard;