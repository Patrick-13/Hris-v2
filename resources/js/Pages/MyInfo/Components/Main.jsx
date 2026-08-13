import React, { useState } from "react";
import Index from "../Pages/Contact/Index";
import IndexPersonnal from "../Pages/Personal/Index";
import Dependent from "../Pages/Dependent/Index";
import Job from "../Pages/Job/Index";
import Salary from "../Pages/Salary/Index";
import Migration from "../Pages/Migration/Index";
import { FaEdit } from "react-icons/fa";
import Modal from "@/Components/Modal";
import Edit from "../../Admin/PersonelEmployee/Modal/Edit";
import Emergency from "../Pages/Contact/Emergency";
import Qualification from "../Pages/Qualification/Index";
import LoanOtherEarningDeduction from "../Pages/LoanOtherEarningDeduction/Index";
import Cto from "../Pages/Cto/Index";

export default function Main({
    auth,
    employeeinfos,
    personnelLeave,
    employeeinfoedits,
    activeTab,
}) {
    const employee = employeeinfos.data[0];
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(
        employeeinfoedits || null,
    );
    const [activeTabContact, setActiveTabContact] = useState("personalcontact");

    const handleEditClick = async (employeeId) => {
        try {
            const response = await axios.get(
                `/user/employee/${employeeId}/edit`,
            );
            setSelectedEmployee(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };
    return (
        <div className="flex-1 ml-4 border rounded-lg p-4">
            {activeTab === "personal" && (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center gap-4">
                        Personnal Detailts
                        <button
                            auth={auth}
                            onClick={() => handleEditClick(employee.id)}
                            className="font-medium text-blue dark:text-blue-500 hover:underline"
                        >
                            <FaEdit className="text-green-500" size={24} />
                        </button>
                    </h1>
                    <IndexPersonnal auth={auth} employeeinfos={employeeinfos} />
                </div>
            )}
            {activeTab === "contact" && (
                <div>
                    <div className="flex space-x-4 border-b mb-4">
                        <button
                            onClick={() =>
                                setActiveTabContact("personalcontact")
                            }
                            className={`px-4 py-2 ${
                                activeTabContact === "personalcontact"
                                    ? "border-b-2 border-blue-500 font-semibold"
                                    : "text-gray-500"
                            }`}
                        >
                            Personal Contact
                        </button>
                        <button
                            onClick={() => setActiveTabContact("emergency")}
                            className={`px-4 py-2 ${
                                activeTabContact === "emergency"
                                    ? "border-b-2 border-blue-500 font-semibold"
                                    : "text-gray-500"
                            }`}
                        >
                            Emergency Contact
                        </button>
                    </div>

                    {/* Tab contents */}
                    {activeTabContact === "personalcontact" && (
                        <div>
                            <h3 className="text-lg font-semibold">
                                Personal Contact
                            </h3>
                            <Index auth={auth} contactdetails={employeeinfos} />
                        </div>
                    )}

                    {activeTabContact === "emergency" && (
                        <div>
                            <h3 className="text-lg font-semibold">
                                Emergency Contact
                            </h3>
                            <Emergency
                                auth={auth}
                                contactdetails={employeeinfos}
                            />
                        </div>
                    )}
                </div>
            )}

            {activeTab === "dependent" && (
                <div>
                    <h3 className="text-lg font-semibold">Dependents</h3>
                    <Dependent auth={auth} contactdetails={employeeinfos} />
                </div>
            )}
            {activeTab === "immigration" && (
                <div>
                    <h3 className="text-lg font-semibold">Immigration</h3>
                    <Migration auth={auth} contactdetails={employeeinfos} />
                </div>
            )}
            {activeTab === "job" && (
                <div>
                    <h3 className="text-lg font-semibold">Job</h3>
                    <Job auth={auth} contactdetails={employeeinfos} />
                </div>
            )}
            {activeTab === "salary" && (
                <div>
                    <h3 className="text-lg font-semibold">Salary</h3>
                    <Salary auth={auth} contactdetails={employeeinfos} />
                </div>
            )}
            {activeTab === "other" && (
                <div>
                    <h3 className="text-lg font-semibold">
                        Other Earnings & Deductions
                    </h3>
                    <LoanOtherEarningDeduction
                        auth={auth}
                        contactdetails={employeeinfos}
                    />
                </div>
            )}
            {activeTab === "cto" && (
                <div>
                    <h3 className="text-lg font-semibold">
                        Compensatory Time-off
                    </h3>
                    <Cto
                        auth={auth}
                        contactdetails={employeeinfos}
                        personnelLeave={personnelLeave}
                    />
                </div>
            )}
            {activeTab === "qualification" && (
                <div>
                    <h3 className="text-lg font-semibold">Qualification</h3>
                    <Qualification auth={auth} contactdetails={employeeinfos} />
                </div>
            )}
            <Modal
                show={showModalEdit}
                onClose={() => setShowModalEdit(false)}
                closeable={true}
                maxWidth="4xl" // ← use this to expand the modal
            >
                <Edit
                    auth={auth}
                    employees={selectedEmployee}
                    closeModal={() => setShowModalEdit(false)}
                />
            </Modal>
        </div>
    );
}
