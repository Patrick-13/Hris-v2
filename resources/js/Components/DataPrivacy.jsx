import React, { useState } from "react";
import axios from "axios";

const DataPrivacy = ({ privacyAccepted }) => {
    const [showPrivacyModal, setShowPrivacyModal] = useState(!privacyAccepted);

    const handlePrivacyAgree = async () => {
        try {
            await axios.post("/user/privacy-consent");

            setShowPrivacyModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!showPrivacyModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-l-8 border-emerald-700 rounded-xl shadow-lg max-w-2xl w-full p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                <h2 className="text-2xl font-bold text-center">
                    Data Privacy Act of 2012
                </h2>

                <p className="text-gray-700 text-xl">
                    By continuing to use this Human Resource Management System
                    V2, you consent to the collection, processing, and storage
                    of your personal information as outlined under Republic Act
                    No. 10173 or the Data Privacy Act of 2012. Your data will be
                    used solely for official purposes by the DENR - EMB XI. We
                    ensure confidentiality and security in accordance with the
                    law and its Implementing Rules and Regulations.
                </p>

                <div className="text-right">
                    <button
                        onClick={handlePrivacyAgree}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
                    >
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataPrivacy;
