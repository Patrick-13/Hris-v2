import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaEye, FaPaperclip, FaPencilAlt, FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import Show from "./Modal/Show";
import { SearchBar } from "@/Components/SearchBar";
import ModalDrawer from "@/Components/ModalDrawer";
import Create from "./Modal/Create";
import Modal from "@/Components/Modal";
import Attachment from "./Modal/Attachment";
import Edit from "./Modal/Edit";
export default function Index({
    auth,
    activityypes,
    activities,
    activityedits,
    employees,
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
    const [showModalAttachment, setShowModalAttachment] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(
        activityedits || null,
    );

    const handleShowClick = async (activityId) => {
        try {
            const response = await axios.get(
                `/user/myactivity/${activityId}/show`,
            );
            setSelectedActivity(response.data); // Set the fetched product data
            setShowModalShow(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleEditClick = async (activityId) => {
        try {
            const response = await axios.get(
                `/user/myactivity/${activityId}/edit`,
            );
            setSelectedActivity(response.data); // Set the fetched product data

            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleAttachClick = async (activityId) => {
        try {
            const response = await axios.get(
                `/user/myactivity/${activityId}/attach`,
            );
            setSelectedActivity(response.data); // Set the fetched product data
            setShowModalAttachment(true); // Open the modal
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
            router.get(route("myactivity.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "activities",
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
        router.get(route("myactivity.index"), queryParams);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Activities
                </h2>
            }
        >
            <Head title="Activity" />

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
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <FaPlus size={14} />
                                        <span className="font-medium">
                                            Add New Activity
                                        </span>
                                    </button>
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
                                                    name="title_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Activity Type
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
                                                <th>Attach Files</th>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities &&
                                            activities.data.length > 0 ? (
                                                activities.data.map(
                                                    (activity) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={activity.id}
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    activity.soNumber
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    activity
                                                                        .activityTypeBy
                                                                        .name
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {new Date(
                                                                    activity.dateFrom,
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
                                                                    activity.dateTo,
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
                                                                {activity.type}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {activity.venue}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    activity.description
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <td className="px-3 py-2">
                                                                    {activity.activityFileBy &&
                                                                    activity
                                                                        .activityFileBy
                                                                        .activityFile ? (
                                                                        <a
                                                                            href={`/user/myactivityfile/${encodeURIComponent(
                                                                                activity
                                                                                    .activityFileBy
                                                                                    .activityFile,
                                                                            )}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-500 hover:underline"
                                                                        >
                                                                            View
                                                                            File
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-gray-400 italic">
                                                                            No
                                                                            file
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                <button
                                                                    onClick={() =>
                                                                        handleAttachClick(
                                                                            activity.id,
                                                                        )
                                                                    }
                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                >
                                                                    <FaPaperclip
                                                                        className="text-orange-500"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>

                                                                {/* <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            activity.id,
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
                                                                </button> */}
                                                                <button
                                                                    onClick={() =>
                                                                        handleShowClick(
                                                                            activity.id,
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
                                            activities && activities.meta.links
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
                        employeeId={auth.user?.employee_id}
                        activityypes={activityypes}
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
                        employeeId={auth.user?.employee_id}
                        activityypes={activityypes}
                        queryParams={queryParams}
                        activities={selectedActivity}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>

                <Modal
                    show={showModalAttachment}
                    onClose={() => setShowModalAttachment(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Attachment
                        activityfiles={selectedActivity}
                        closeModal={() => setShowModalAttachment(false)}
                    />
                </Modal>

                <ModalDrawer
                    show={showModalShow}
                    onClose={() => setShowModalShow(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Show
                        activityemployees={employees}
                        activityypes={activityypes}
                        queryParams={queryParams}
                        activities={selectedActivity}
                        closeModal={() => setShowModalShow(false)}
                    />
                </ModalDrawer>
            </div>
        </AuthenticatedLayout>
    );
}
