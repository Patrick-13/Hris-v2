import { FaPaperclip } from "react-icons/fa";
import { useState } from "react";
import Attachment from "./Modal/attachment";
import Modal from "@/Components/Modal";

export default function Index({
    auth,
    contactdetails,
    contactdetailedits,
    queryParams = null,
}) {
    queryParams = queryParams || {};
    const [showModal, setShowModal] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(
        contactdetailedits || null
    );

    const handleAttachClick = async (trainingId) => {
        try {
            const response = await axios.get(`/user/training/${trainingId}/attach`);
            setSelectedTraining(response.data); // Set the fetched product data
            setShowModal(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    return (
        <div className="py-2">
            <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-auto">
                            <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-emerald-600">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">S.O #</th>
                                            <th className="px-3 py-2">
                                                Date Conducted
                                            </th>
                                            <th className="px-3 py-2">Title</th>
                                            <th className="px-3 py-2">Type</th>
                                            <th className="px-3 py-2">Venue</th>
                                            <th className="px-3 py-2">
                                                Description
                                            </th>
                                            <th className="px-3 py-2">ILR</th>
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
                                                    contactdetail.trainings.map(
                                                        (training, index) => {
                                                            // Find the file(s) for this employee & training
                                                            const file =
                                                                contactdetail.trainingFilesBy?.find(
                                                                    (f) =>
                                                                        f.training_id ===
                                                                            training.id &&
                                                                        f.employee_id ===
                                                                            contactdetail.employee_id
                                                                );

                                                            return (
                                                                <tr
                                                                    key={`${training.id}-${training.id}-${index}`}
                                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                >
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            training.soNumber
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {training.dateFrom +
                                                                            " - " +
                                                                            training.dateTo}
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            training.title
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            training.type
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            training.venue
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {
                                                                            training.description
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {file ? (
                                                                            <a
                                                                                href={`/user/trainingfile/${encodeURIComponent(
                                                                                    file.ilrFile
                                                                                ).replace(
                                                                                    /%2F/g,
                                                                                    "/"
                                                                                )}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-500 hover:underline"
                                                                            >
                                                                                View
                                                                                File
                                                                            </a>
                                                                        ) : (
                                                                            "No file"
                                                                        )}
                                                                    </td>

                                                                    <td className="px-3 py-2 flex text-nowrap">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleAttachClick(
                                                                                    training.id
                                                                                )
                                                                            }
                                                                            className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                        >
                                                                            <FaPaperclip
                                                                                className="text-blue-500"
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
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
                <Attachment
                    auth={auth}
                    trainingfiles={selectedTraining}
                    closeModal={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
}
