import { router } from "@inertiajs/react";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import Modal from "@/Components/Modal";
import Edit from "./Modal/Edit";
import CreateEmergency from "./Modal/CreateEmergency";
import EditEmergency from "./Modal/EditEmergency";
export default function Emergency({
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
    const [selectedContactDetail, setSelectedContactDetail] = useState(
        contactdetailedits || null
    );

    const handleEditClick = async (emegencycontactId) => {
        try {
            const response = await axios.get(
                `/user/emergencycontact/${emegencycontactId}/edit`
            );
            setSelectedContactDetail(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };


    const deleteEmergency = (contactdetail) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${contactdetail.employee_id} contact detail?`
            )
        ) {
            return;
        }
        router.delete(route("mycontact.destroy", contactdetail.id));
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
                                            <span>Add Emergency Contact</span>
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
                                                    Fullname
                                                </th>
                                                <th className="px-3 py-2">
                                                    Relationship
                                                </th>
                                                <th className="px-3 py-2">
                                                    Phone #
                                                </th>
                                                <th className="px-3 py-2">
                                                    Work Phone #
                                                </th>
                                                <th className="px-3 py-2">
                                                    Mobile #
                                                </th>
                                                <th className="px-3 py-2">
                                                    Status
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
                                                        contactdetail.employeeEmergencyBy.map(
                                                            (
                                                                emergency,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                    key={`${emergency.id}-${emergency.id}-${index}`}
                                                                >
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            emergency.fullName
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            emergency.relationship
                                                                        }
                                                                    </td>

                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            emergency.phoneNumber
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            emergency.workPhoneNumber
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            emergency.mobileNumber
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        <span
                                                                            className={
                                                                                emergency.status ==
                                                                                0
                                                                                    ? "text-green-600 font-semibold"
                                                                                    : "text-red-600 font-semibold"
                                                                            }
                                                                        >
                                                                            {emergency.status ==
                                                                            0
                                                                                ? "Active"
                                                                                : "Inactive"}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-3 py-2 flex text-nowrap">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEditClick(
                                                                                    emergency.id
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
                                                                                deleteEmergency(
                                                                                    emergency
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
                    <CreateEmergency
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
                    <EditEmergency
                        auth={auth}
                        contactdetails={selectedContactDetail}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </div>
    );
}
