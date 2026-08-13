import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    auth,
    formtype,
    downloadableforms,
    downloadableformedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(auth);
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [userButtons, setUserButtons] = useState([]);
    const [selectedDownloadableform, setSelectedDownloadableform] = useState(
        downloadableformedits || null,
    );

    const handleEditClick = async (dowloadableformId) => {
        try {
            const response = await axios.get(
                `/admin/downloadformadmin/${dowloadableformId}/edit`,
            );
            setSelectedDownloadableform(response.data); // Set the fetched product data
            console.log(response.data);
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

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

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }

            console.log("Updated Query Params:", updatedQueryParams);
            router.get(route("downloadformadmin.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "downloadableforms",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("downloadformadmin.index"), queryParams);
    };

    const deleteDownloadbleform = (downloadableform) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${downloadableform.name} Form Type?`,
            )
        ) {
            return;
        }
        router.delete(route("downloadformadmin.destroy", downloadableform.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Downloadble Forms
                </h2>
            }
        >
            <Head title="Downloadable Form" />

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
                                    {hasButton(3) && (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                        >
                                            <FaPlus size={14} />
                                            <span className="font-medium">
                                                New
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
                                                {/* <TableHeading
                                                    name="id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    ID
                                                </TableHeading> */}
                                                <TableHeading
                                                    name="name "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Form Name
                                                </TableHeading>
                                                <TableHeading
                                                    name="description "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Form Description
                                                </TableHeading>
                                                <TableHeading
                                                    name="form_type "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Form Type
                                                </TableHeading>
                                                <TableHeading
                                                    name="form_type "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Downloadable Document
                                                </TableHeading>
                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {downloadableforms &&
                                            downloadableforms.data.length >
                                                0 ? (
                                                downloadableforms.data.map(
                                                    (downloadableform) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                downloadableform.id
                                                            }
                                                        >
                                                            {/* <td className="px-3 py-2">
                                                                {
                                                                    downloadableform.id
                                                                }
                                                            </td> */}
                                                            <td className="px-3 py-2">
                                                                {
                                                                    downloadableform.name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    downloadableform.description
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    downloadableform
                                                                        .formtypeBy
                                                                        ?.name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <a
                                                                    href={`/admin/downloadformadmin/${encodeURIComponent(
                                                                        downloadableform.dfFile,
                                                                    ).replace(
                                                                        /%2F/g,
                                                                        "/",
                                                                    )}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline"
                                                                >
                                                                    Download
                                                                    File
                                                                </a>
                                                            </td>
                                                            {auth.user.role ===
                                                                "admin" && (
                                                                <td className="px-3 py-2 flex text-nowrap">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                downloadableform.id,
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
                                                                            e,
                                                                        ) =>
                                                                            deleteDownloadbleform(
                                                                                downloadableform,
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
                                                            )}
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
                                            downloadableforms &&
                                            downloadableforms.meta.links
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
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Create
                        formtypes={formtype}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Edit
                        formtypes={formtype}
                        downloadbleforms={selectedDownloadableform}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
