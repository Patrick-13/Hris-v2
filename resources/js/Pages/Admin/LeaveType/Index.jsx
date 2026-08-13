import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
export default function Index({
    leavetypes,
    leavetypeedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(
        leavetypeedits || null
    );

    const handleEditClick = async (leavetypeId) => {
        try {
            const response = await axios.get(`/leavetype/${leavetypeId}/edit`);
            setSelectedLeaveType(response.data); // Set the fetched product data
            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const searchFieldChanged = (field, value) => {
        const updatedQueryParams = { ...queryParams };
        if (value) {
            updatedQueryParams[field] = value; // Use field instead of agencyName
        } else {
            delete updatedQueryParams[field]; // Use field instead of agencyName
        }
        router.replace(route("leavetype.index"), {
            method: "get",
            data: updatedQueryParams,
        });
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
        router.get(route("leavetype.index"), queryParams);
    };

    const deleteLeavetype = (leavetype) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${leavetype.name} Leave Type?`
            )
        ) {
            return;
        }
        router.delete(route("leavetype.destroy", leavetype.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Type
                </h2>
            }
        >
            <Head title="Leave Type" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="relative flex flex-col gap-4 mb-5">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="relative flex items-center gap-2">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={toggleDropdown}
                                                    className="max-w-9xl mx-auto sm:px-6 lg:px-8 bg-gray-400 py-1 px-3 text-white rounded shadow transition-all hover:bg-gray-600 flex items-center gap-1 sm:w-auto"
                                                >
                                                    <CiFilter size={18} />
                                                    <span>Filters</span>
                                                </button>
                                            </div>
                                            {showDropdown && (
                                                <div
                                                    className="absolute  top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-lg transition-opacity duration-300 opacity-100 z-30"
                                                    style={{
                                                        maxHeight:
                                                            "calc(100vh - 64px)",
                                                    }}
                                                >
                                                    <div className="flex flex-col gap-4">
                                                        <TextInput
                                                            className="w-full"
                                                            defaultValue={
                                                                queryParams.name
                                                            }
                                                            placeholder="Search Leave Type"
                                                            onBlur={(e) =>
                                                                searchFieldChanged(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onKeyPress={(e) =>
                                                                onKeyPress(
                                                                    "name",
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setShowModal(true)
                                                }
                                                className="max-w-9xl mx-auto sm:px-6 lg:px-8 bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 flex items-center gap-1"
                                            >
                                                <FaPlus size={14} />
                                                <span>New</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                        <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="text-nowrap">
                                                    <TableHeading
                                                        name="id"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        ID
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="name"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Leave Name
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="default_entitlement"
                                                        sort_field={
                                                            queryParams.sort_field
                                                        }
                                                        sort_direction={
                                                            queryParams.sort_direction
                                                        }
                                                        sortChanged={
                                                            sortChanged
                                                        }
                                                    >
                                                        Default Entitlement
                                                    </TableHeading>

                                                    <th className="px-3 py-2">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leavetypes &&
                                                leavetypes.data.length > 0 ? (
                                                    leavetypes.data.map(
                                                        (leavetype) => (
                                                            <tr
                                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                key={
                                                                    leavetype.id
                                                                }
                                                            >
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        leavetype.id
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        leavetype.name
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        leavetype.default_entitlement
                                                                    }
                                                                </td>

                                                                <td className="px-3 py-2 flex text-nowrap">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                leavetype.id
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
                                                                            deleteLeavetype(
                                                                                leavetype
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
                                                leavetypes &&
                                                leavetypes.meta.links
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
                        <Create closeModal={() => setShowModal(false)} />
                    </Modal>

                    <Modal
                        show={showModalEdit}
                        onClose={() => setShowModalEdit(false)}
                        closeable={true}
                        maxWidth="2xl" // ← use this to expand the modal
                    >
                        <Edit
                            leavetypes={selectedLeaveType}
                            closeModal={() => setShowModalEdit(false)}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
