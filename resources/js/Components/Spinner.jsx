import React from "react";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({ showProgresseemailModal }) => {
    return (
        <div>
            {showProgresseemailModal && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex items-center justify-center space-x-2">
                            <FaSpinner className="animate-spin h-5 w-5 text-blue-500" />
                            <p className="text-gray-700 text-lg">
                                Email Report Generation & Distribution...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Spinner;
