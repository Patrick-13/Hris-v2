import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CiGlobe } from "react-icons/ci";
import {
    FaClock,
    FaDownload,
    FaFileInvoiceDollar,
    FaMoneyBillWave,
    FaPenNib,
    FaPhone,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { TbFileCertificate } from "react-icons/tb";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Sidebar({ auth, activeTab, setActiveTab }) {
    const employeeId = auth.user.employee_id; // TODO: replace with dynamic value
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [signatureUrl, setSignatureUrl] = useState(null);
    const fileInputRef = useRef();
    const signatureInputRef = useRef();

    // ✅ Load existing images on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(
                    `/user/employeeprofilesignature/${employeeId}`
                );
                if (data.profile_picture_url)
                    setProfileImage(data.profile_picture_url);
                if (data.esignature_url) setSignatureUrl(data.esignature_url);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, [employeeId]);

    // ✅ Auto upload profile photo on file select
    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        setProfileImage(URL.createObjectURL(file));

        // Auto upload
        const formData = new FormData();
        formData.append("employee_id", employeeId);
        formData.append("profilePicture", file);

        try {
            await axios.post("/user/employeeprofilesignature", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Profile uploaded automatically");
        } catch (error) {
            toast.error("Profile upload failed:", error);
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    // ✅ Auto upload signature
    const handleSignatureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSignatureUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("employee_id", employeeId);
        formData.append("profileEsignature", file);

        try {
            await axios.post("/user/employeeprofilesignature", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("✅ E-signature uploaded automatically");
        } catch (error) {
            console.error("E-signature upload failed:", error);
        }
    };

    const handleUploadSignature = () => {
        signatureInputRef.current.click();
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/user/export-pds", {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "PDS_2025.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const items = [
        { key: "personal", label: "Personal Details", icon: <FaUser /> },
        { key: "contact", label: "Contact", icon: <FaPhone /> },
        { key: "dependent", label: "Dependent", icon: <FaUsers /> },
        { key: "immigration", label: "Immigration", icon: <CiGlobe /> },
        { key: "job", label: "Job", icon: <MdOutlineWorkOutline /> },
        { key: "salary", label: "Salary", icon: <FaMoneyBillWave /> },
        {
            key: "other",
            label: "Other Earnings & Deduction",
            icon: <FaFileInvoiceDollar />,
        },
        {
            key: "qualification",
            label: "Qualification",
            icon: <TbFileCertificate />,
        },
        { key: "cto", label: "Cto", icon: <FaClock /> },
    ];

    return (
        <div className="w-80 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
            {/* Profile Upload */}
            <div className="relative mb-6 w-full">
                <div
                    className="w-full h-48 p-1 rounded-lg overflow-hidden border-2 border-blue-500 cursor-pointer group"
                    onClick={handleProfileClick}
                >
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-contain object-center rounded-md"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 group-hover:opacity-80 transition">
                            <FiCamera size={32} />
                            <span className="text-sm mt-1">Upload</span>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileChange}
                    className="hidden"
                />
            </div>

            {/* Sidebar Tabs */}
            <ul className="w-full space-y-1">
                {items.map((item) => (
                    <li
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200
                            ${
                                activeTab === item.key
                                    ? "bg-blue-500 text-white dark:bg-blue-600 shadow"
                                    : "hover:bg-blue-100 hover:dark:bg-gray-600 hover:text-blue-600"
                            }`}
                    >
                        <span className="mr-2 text-lg">{item.icon}</span>
                        {item.label}
                    </li>
                ))}
            </ul>

            {/* Download and Signature */}
            <div className="w-full pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white font-semibold transition-all duration-200 
                        ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg"
                        }`}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                ></path>
                            </svg>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <FaDownload />
                            Download PDS
                        </>
                    )}
                </button>

                <button
                    onClick={handleUploadSignature}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <FaPenNib />
                    Upload E-Signature
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={signatureInputRef}
                    onChange={handleSignatureChange}
                    className="hidden"
                />

                <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center w-[3in] h-[2.1in] overflow-hidden">
                    {signatureUrl ? (
                        <img
                            src={signatureUrl}
                            alt="E-Signature Preview"
                            className="w-full h-full object-contain object-center  rounded-md"
                        />
                    ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            No E-Signature uploaded
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
