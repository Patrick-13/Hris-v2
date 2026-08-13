import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Loan from "./Loan";
import OtherEarning from "./OtherEarning";
import OtherDeduction from "./OtherDeduction";

const Layout = ({ auth, contactdetails }) => {
    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    return (
        <div className="max-w-9xl mx-auto mt-4 space-y-2">
            {/* Accordion: Loan */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("loan")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Loan</span>
                    {openAccordion === "loan" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "loan" && (
                    <div className="border-t p-2 bg-gray-50">
                        <Loan />
                    </div>
                )}
            </div>

            {/* Other Earning */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("otherearning")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Other Earning</span>
                    {openAccordion === "otherearning" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "otherearning" && (
                    <div className="border-t p-2 bg-gray-50">
                        <OtherEarning />
                    </div>
                )}
            </div>

            {/* Accordion: Other Deduction */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("otherdeduction")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Other Deduction</span>
                    {openAccordion === "otherdeduction" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "otherdeduction" && (
                    <div className="border-t p-2 bg-gray-50">
                        <OtherDeduction />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
