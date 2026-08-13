import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import { SearchBar } from "@/Components/SearchBar";
import Create from "./Modal/Create";
import Modal from "@/Components/Modal";
import Edit from "./Modal/Edit";
export default function Index({
    holidays,
    holidayedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(
        holidayedits || null,
    );
    const handleEditClick = async (holidayId) => {
        try {
            const response = await axios.get(`/user/holiday/${holidayId}/edit`);
            setSelectedHoliday(response.data); // Set the fetched product data
            setShowModalEdit(true); // Open the modal
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
            router.get(route("holiday.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "holidays",
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
        router.get(route("holiday.index"), queryParams);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Holiday
                </h2>
            }
        >
            <Head title="Holiday" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-auto">
                                        <SearchBar
                                            queryParams={queryParams}
                                            searchFieldChanged={
                                                searchFieldChanged
                                            }
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-emerald-500 py-2 px-4 text-white rounded shadow hover:bg-emerald-600 flex items-center gap-1"
                                    >
                                        <FaPlus size={14} />
                                        <span>New</span>
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                        <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="text-nowrap">
                                                    <TableHeading
                                                        name="holiday_date"
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
                                                        Date
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
                                                        Name
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="type"
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
                                                        Type
                                                    </TableHeading>

                                                    <th className="px-3 py-2">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {holidays &&
                                                holidays.data.length > 0 ? (
                                                    holidays.data.map(
                                                        (holiday) => (
                                                            <tr
                                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                key={holiday.id}
                                                            >
                                                                <td className="px-3 py-2">
                                                                    {new Date(
                                                                        holiday.holiday_date,
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "long",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        },
                                                                    )}{" "}
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        holiday.name
                                                                    }
                                                                </td>

                                                                <td className="px-3 py-2">
                                                                    {
                                                                        holiday.type
                                                                    }
                                                                </td>

                                                                <td className="px-3 py-2 flex text-nowrap">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                holiday.id,
                                                                            )
                                                                        }
                                                                        className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                    >
                                                                        <FaPencilAlt
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
                                                holidays && holidays.meta.links
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
                        <Create closeModal={() => setShowModal(false)} />
                    </Modal>

                    <Modal
                        show={showModalEdit}
                        onClose={() => setShowModalEdit(false)}
                        closeable={true}
                        maxWidth="4xl" // ← use this to expand the modal
                    >
                        <Edit
                            holiday={selectedHoliday}
                            closeModal={() => setShowModalEdit(false)}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
