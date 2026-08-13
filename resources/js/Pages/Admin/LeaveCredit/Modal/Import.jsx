import { useState } from "react";
import { Link } from "@inertiajs/react";

import { FaSpinner } from "react-icons/fa"; // Importing a loading spinner icon

export default function Import() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowProgressModal(true);

        try {
            const formData = new FormData();
            formData.append("leavecredit_file", file);

            const response = await fetch(route("leavecredit.import"), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formData,
                // Track upload progress
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadPercentage(percentCompleted);
                },
            });

            if (response.ok) {
                setSuccessMessage("Leave Credit data imported successfully.");
            } else {
                const responseData = await response.json(); // Assuming the response contains JSON data

                if (responseData && responseData.error) {
                    setErrorMessage(responseData.error);
                } else {
                    setErrorMessage(
                        "Error importing Leave Credit data. Please try again later.",
                    );
                }
            }
        } catch (error) {
            console.error("Error importing Leave Credit data:", error);
            setErrorMessage("Error follow file format to upload data!.");
        } finally {
            setLoading(false);
            setShowProgressModal(false);
        }
    };

    return (
        <div className="py-2">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        Import Employee Leave Credits
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Upload a CSV file to import employee leave credits
                        records
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <form
                        className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <input
                                type="file"
                                name="leavecredit_file"
                                onChange={handleFileChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        {file && (
                            <div className="mt-2 flex items-center">
                                <span className="mr-2">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Clear
                                </button>
                            </div>
                        )}

                        <div className="mt-4 text-right">
                            <Link
                                href={route("leavecredit.index")}
                                className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                            >
                                Close
                            </Link>
                            <button
                                id="submitBtn"
                                type="submit"
                                className={`bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 ${
                                    loading && "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={loading || !file}
                            >
                                {loading ? <>Uploading...</> : "Submit"}
                            </button>
                        </div>

                        {successMessage && (
                            <div className="mt-4 text-green-600">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="mt-4 text-red-600">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {showProgressModal && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 overflow-hidden">
                        {/* Header */}
                        <div className="bg-emerald-600 text-white px-4 py-3 flex justify-between items-center">
                            <h2 className="text-sm font-semibold uppercase">
                                Uploading File
                            </h2>

                            {/* Optional close button */}
                            {!loading && (
                                <button
                                    onClick={() => setShowProgressModal(false)}
                                    className="text-white hover:text-gray-200 text-lg leading-none"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-6 flex flex-col items-center">
                            <FaSpinner className="animate-spin text-4xl text-emerald-600 mb-4" />

                            <p className="text-sm text-gray-600 mb-2">
                                Please wait while your file is uploading...
                            </p>

                            {/* Progress Percentage (optional) */}
                            <span className="text-emerald-600 font-semibold">
                                {uploadPercentage}%
                            </span>

                            {/* ✅ Progress bar goes HERE */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div
                                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
