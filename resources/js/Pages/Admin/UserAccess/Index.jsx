import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination"; // Assuming you have a Pagination component
import { FaEye } from "react-icons/fa";
import { useRef, useState } from "react";
import TextInput from "@/Components/TextInput";
import { SearchBar } from "@/Components/SearchBar";
import Edit from "./Modal/Edit";
import Modal from "@/Components/Modal";

export default function Index({
    auth,
    users,
    useredits,
    queryParams = null, // Provide a default empty object
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(useredits || null);

    const handleEditClick = async (userId) => {
        try {
            const response = await axios.get(`/admin/user/${userId}/edit`);
            setSelectedUser(response.data); // Set the fetched product data

            setShowModalEdit(true); // Open the modal
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("usermodule.index"), newParams);
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
            router.get(route("usermodule.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "users",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 500); // Wait 1000ms after user stops typing
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
        router.get(route("usermodule.index"), queryParams);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center gap-2">
                        <span>Users Module List</span>
                    </h2>
                </div>
            }
        >
            <Head title="User List" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg darkMode ? 'dark' : ''">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="relative flex flex-col gap-4 mb-5">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="relative flex items-center gap-2">
                                        <SearchBar
                                            queryParams={queryParams}
                                            searchFieldChanged={
                                                searchFieldChanged
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 flex flex-wrap items-center justify-center sm:justify-start">
                                <InputLabel
                                    htmlFor="show"
                                    value="Show"
                                    className="w-full sm:w-auto mb-2 sm:mb-0 sm:ml-2 text-lg"
                                />
                                <SelectInput
                                    className="w-full sm:w-auto mb-2 sm:mb-0 sm:ml-2"
                                    value={queryParams.per_page || 5} // Use a default value if undefined
                                    onChange={handleRowsPerPageChange}
                                >
                                    {[10, 15, 20, 30].map((perPage) => (
                                        <option key={perPage} value={perPage}>
                                            {perPage} Rows
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                    ID
                                                </th>
                                                <th className="px-3 py-2">
                                                    Username
                                                </th>
                                                <th className="px-3 py-2">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={user.id}
                                                >
                                                    <td className="px-3 py-2">
                                                        {user.id}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-3 py-2 flex text-nowrap gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            <FaPencilAlt
                                                                className="text-green-500"
                                                                size={18}
                                                            />
                                                        </button>
                                                        <Link
                                                            href={route(
                                                                "usermodule.show",
                                                                user.id,
                                                            )}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            <FaEye
                                                                className="text-blue-500"
                                                                size={18}
                                                            />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <Pagination
                                links={users.links} // Provide default empty array if undefined
                                totalCount={totalCount}
                                currentPageCount={currentPageCount}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>

                    <Modal
                        show={showModalEdit}
                        onClose={() => setShowModalEdit(false)}
                        closeable={true}
                        maxWidth="2xl" // ← use this to expand the modal
                    >
                        <Edit
                            users={selectedUser}
                            closeModal={() => setShowModalEdit(false)}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
