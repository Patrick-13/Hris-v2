import { router } from "@inertiajs/react";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
export default function Index({
    auth,
    contactdetails,
    contactdetailedits,
    queryParams = null,
}) {
    console.log(contactdetails);
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(
        contactdetailedits || null
    );

    const handleEditClick = async (educationId) => {
        try {
            const response = await axios.get(`/education/${educationId}/edit`);
            setSelectedEducation(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const deleteEducation = (education) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${education.employee_id} Education?`
            )
        ) {
            return;
        }
        router.delete(route("education.destroy", education.id));
    };

    return (
        <div className="py-2">
            <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-auto">
                            <div className="relative flex flex-col gap-4 mb-5">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="relative flex items-center gap-2">
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="max-w-9xl mx-auto sm:px-6 lg:px-8 bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 flex items-center gap-1"
                                        >
                                            <FaPlus size={14} />
                                            <span>Add Education Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-emerald-600">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                    Education Level
                                                </th>
                                                <th className="px-3 py-2">
                                                    School Name
                                                </th>
                                                <th className="px-3 py-2">
                                                    Degree/Course
                                                </th>
                                                <th className="px-3 py-2">
                                                    Year Graduated
                                                </th>
                                                <th className="px-3 py-2">
                                                    Honor Recevied
                                                </th>
                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactdetails &&
                                            contactdetails.data.length > 0 ? (
                                                contactdetails.data.map(
                                                    (contactdetail) =>
                                                        contactdetail.employeeEducationBy.map(
                                                            (
                                                                education,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={`${education.id}-${education.id}-${index}`}
                                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                >
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            education.educationLevel
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            education.schoolName
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            education.degree
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            education.yeargraduate
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            education.scholarship_honors
                                                                        }
                                                                    </td>

                                                                    <td className="px-3 py-2 flex text-nowrap">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEditClick(
                                                                                    education.id
                                                                                )
                                                                            }
                                                                            className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                        >
                                                                            <FaPencilAlt
                                                                                className="text-green-500"
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>

                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                deleteEducation(
                                                                                    education
                                                                                )
                                                                            }
                                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                                        >
                                                                            <FaTrashAlt
                                                                                className="text-red-600"
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="11"
                                                        className="text-center py-4"
                                                    >
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Create
                        auth={auth}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Edit
                        auth={auth}
                        educations={selectedEducation}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </div>
    );
}
