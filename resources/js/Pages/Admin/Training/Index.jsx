import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaPlus, FaPencilAlt, FaEye } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import Show from "./Modal/Show";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    auth,
    trainings,
    trainingedits,
    trainingemployees,
    divisions,
    sections,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const debounceTimeout = useRef(null);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalShow, setShowModalShow] = useState(false);
    const [userButtons, setUserButtons] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(
        trainingedits || null,
    );

    useEffect(() => {
        if (!auth?.user?.id) return; // Early return if user ID is not available

        const userId = auth.user.id; // Extract user ID from auth object

        // Fetch user modules and submodules in parallel only if there are updates
        const fetchData = async () => {
            try {
                // Make the two requests in parallel
                const [buttonResponse] = await Promise.all([
                    axios.get(`/user/${userId}/buttons`),
                ]);

                // Update the state with the new data
                setUserButtons(buttonResponse.data);
            } catch (error) {
                console.error(
                    "There was an error fetching the user data!",
                    error,
                );
            }
        };

        fetchData(); // Call the fetch function
    }, [auth?.user?.id]);

    const hasButton = (buttonId) => userButtons.includes(Number(buttonId));

    const handleEditClick = async (trainingId) => {
        try {
            const response = await axios.get(
                `/admin/training/${trainingId}/edit`,
            );
            setSelectedTraining(response.data); // Set the fetched product data

            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleShowClick = async (trainingId) => {
        try {
            const response = await axios.get(
                `/admin/training/${trainingId}/show`,
            );
            setSelectedTraining(response.data); // Set the fetched product data

            setShowModalShow(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }

            router.get(route("training.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "trainings",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (soNumber, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(soNumber, e.target.value);
    };

    const sortChanged = (soNumber) => {
        if (soNumber === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = soNumber;
            queryParams.sort_direction = "asc";
        }
        router.get(route("training.index"), queryParams);
    };

    const deleteTraining = (training) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${training.title} Training?`,
            )
        ) {
            return;
        }
        router.delete(route("training.destroy", training.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Training
                </h2>
            }
        >
            <Head title="Section" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="flex items-center gap-4 mb-5">
                                    {/* Search Input */}
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />

                                    {/* Add Button */}
                                    {hasButton(1) && (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                        >
                                            <FaPlus size={14} />
                                            <span className="font-medium">
                                                Add New Training
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <TableHeading
                                                    name="soNumber"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    S.O #
                                                </TableHeading>
                                                <TableHeading
                                                    name="dateFrom"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date Conducted
                                                </TableHeading>
                                                <TableHeading
                                                    name="title"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Title
                                                </TableHeading>
                                                <TableHeading
                                                    name="type"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Type
                                                </TableHeading>
                                                <TableHeading
                                                    name="venue"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Venue
                                                </TableHeading>
                                                <TableHeading
                                                    name="description"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Description
                                                </TableHeading>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trainings &&
                                            trainings.data.length > 0 ? (
                                                trainings.data.map(
                                                    (training) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={training.id}
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    training.soNumber
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    training.dateFrom,
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "long",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    },
                                                                )}{" "}
                                                                -{" "}
                                                                {new Date(
                                                                    training.dateTo,
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "long",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {training.title}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {training.type}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {training.venue}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    training.description
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            training.id,
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
                                                                    onClick={() =>
                                                                        handleShowClick(
                                                                            training.id,
                                                                        )
                                                                    }
                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                >
                                                                    <FaEye
                                                                        className="text-blue-500"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
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
                                    <Pagination
                                        links={
                                            trainings && trainings.meta.links
                                        }
                                        totalCount={totalCount}
                                        currentPageCount={currentPageCount}
                                        currentPage={currentPage}
                                    />
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
                        trainingemployees={trainingemployees}
                        divisions={divisions}
                        sections={sections}
                        searchFieldChanged={searchFieldChanged}
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
                        trainingemployees={trainingemployees}
                        divisions={divisions}
                        sections={sections}
                        queryParams={queryParams}
                        trainings={selectedTraining}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>

                <Modal
                    show={showModalShow}
                    onClose={() => setShowModalShow(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Show
                        trainingemployees={trainingemployees}
                        queryParams={queryParams}
                        trainings={selectedTraining}
                        closeModal={() => setShowModalShow(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
