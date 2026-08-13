import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import WorkExperience from "./WorkExperience";
import NonGovernmentWork from "./NonGovernmentWork";
import EducationalBackground from "./EducationalBackground";
import Skills from "./Skills";
import LanguageSpoken from "./LanguageSpoken";
import EligibilityLicenses from "./EligibilityLicenses";
import TrainingSeminar from "./TrainingSeminar";
import NonAcademicRecognition from "./NonAcademicRecognition";
import Membership from "./Membership";

const Layout = ({ auth, contactdetails }) => {
    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    return (
        <div className="max-w-9xl mx-auto mt-4 space-y-2">
            {/* Accordion: Work Experience */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("work")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Work Experience</span>
                    {openAccordion === "work" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "work" && (
                    <div className="border-t p-2 bg-gray-50">
                        <WorkExperience
                            auth={auth}
                            contactdetails={contactdetails}
                        />
                    </div>
                )}
            </div>

            {/* Accordion: Non Government */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("nongovernment")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Non Government Work</span>
                    {openAccordion === "nongovernment" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "nongovernment" && (
                    <div className="border-t p-2 bg-gray-50">
                        <NonGovernmentWork />
                    </div>
                )}
            </div>

            {/* Accordion: Educational Background */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("educationalbackground")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Educational Background</span>
                    {openAccordion === "educationalbackground" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "educationalbackground" && (
                    <div className="border-t p-2 bg-gray-50">
                        <EducationalBackground
                            auth={auth}
                            contactdetails={contactdetails}
                        />
                    </div>
                )}
            </div>

            {/* Accordion: Skills */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("skills")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Skills</span>
                    {openAccordion === "skills" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "skills" && (
                    <div className="border-t p-2 bg-gray-50">
                        <Skills auth={auth} contactdetails={contactdetails} />
                    </div>
                )}
            </div>

            {/* Accordion: Language Spoken */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("languagespoken")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Language Spoken</span>
                    {openAccordion === "languagespoken" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "languagespoken" && (
                    <div className="border-t p-2 bg-gray-50">
                        <LanguageSpoken
                            auth={auth}
                            contactdetails={contactdetails}
                        />
                    </div>
                )}
            </div>

            {/* Accordion: Eligibility and Licenses */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("eligibilitylicenses")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Eligibility and Licenses</span>
                    {openAccordion === "eligibilitylicenses" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "eligibilitylicenses" && (
                    <div className="border-t p-2 bg-gray-50">
                        <EligibilityLicenses
                            auth={auth}
                            contactdetails={contactdetails}
                        />
                    </div>
                )}
            </div>
            {/* Accordion: Training and Seminar */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("trainingseminar")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Training and Seminar</span>
                    {openAccordion === "trainingseminar" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "trainingseminar" && (
                    <div className="border-t p-2 bg-gray-50">
                        <TrainingSeminar
                            auth={auth}
                            contactdetails={contactdetails}
                        />
                    </div>
                )}
            </div>

            {/* Accordion: Non Academic Recognition */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("nonacademic")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Non Academic Recognition</span>
                    {openAccordion === "nonacademic" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "nonacademic" && (
                    <div className="border-t p-2 bg-gray-50">
                        <NonAcademicRecognition />
                    </div>
                )}
            </div>

            {/* Accordion: Membership In Association/Organization */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    onClick={() => toggleAccordion("membership")}
                    className="w-full flex justify-between items-center p-4 font-semibold text-gray-700 hover:bg-blue-50 transition"
                >
                    <span>Membership In Association/Organization </span>
                    {openAccordion === "membership" ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </button>
                {openAccordion === "membership" && (
                    <div className="border-t p-2 bg-gray-50">
                        <Membership />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
