import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import Approve from "./Modal/Approve";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    auth,
    tkos,
    tkoedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(tkos);
    queryParams = queryParams || {};
    const [isDisabled, setIsDisabled] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedTko, setSelectedTko] = useState(tkoedits || null);

    const handleEditClick = async (tkoId) => {
        try {
            const response = await axios.get(`/user/mytko/${tkoId}/edit`);
            setSelectedTko(response.data); // Set the fetched product data

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

            router.get(route("mytko.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "tkos",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const onKeyPress = (employee_id, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(employee_id, e.target.value);
    };

    const sortChanged = (employee_id) => {
        if (employee_id === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = employee_id;
            queryParams.sort_direction = "asc";
        }
        router.get(route("mytko.index"), queryParams);
    };

    const deleteCompany = (tko) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${tko.employee_id} employee id tko?`,
            )
        ) {
            return;
        }
        router.delete(route("mytko.destroy", tko.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Tko App
                </h2>
            }
        >
            <Head title="Tko" />

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
                                        disabled={isDisabled}
                                        className={`flex items-center gap-2 py-2 px-4 text-white rounded-lg shadow-sm transition-all
        ${
            isDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600"
        }`}
                                    >
                                        <FaPlus size={14} />
                                        <span>New</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
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
                                                    name="tko_type"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Failed to Register?
                                                </TableHeading>

                                                <TableHeading
                                                    name="date"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date
                                                </TableHeading>
                                                <TableHeading
                                                    name="tko_time"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Time
                                                </TableHeading>
                                                <TableHeading
                                                    name="attachment_file"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Attachment
                                                </TableHeading>
                                                <TableHeading
                                                    name="remarks"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    remarks
                                                </TableHeading>
                                                <TableHeading
                                                    name="level"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    approval status?
                                                </TableHeading>
                                                <th className="px-3 py-2">
                                                    Remarks
                                                </th>
                                                <th className="px-3 py-2">
                                                    TKO Count
                                                </th>
                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tkos && tkos.data.length > 0 ? (
                                                tkos.data.map((tko) => (
                                                    <tr
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                        key={tko.id}
                                                    >
                                                        <td className="px-3 py-2">
                                                            {tko.tko_type}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {tko.date
                                                                ? new Date(
                                                                      tko.date,
                                                                  ).toLocaleDateString(
                                                                      "en-US",
                                                                      {
                                                                          month: "2-digit",
                                                                          day: "2-digit",
                                                                          year: "numeric",
                                                                      },
                                                                  )
                                                                : ""}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {tko.tko_time}
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <a
                                                                href={`/user/mytko/${encodeURIComponent(
                                                                    tko.attachment_file,
                                                                ).replace(
                                                                    /%2F/g,
                                                                    "/",
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                Attachment File
                                                            </a>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {tko.remarks}
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            {tko.approvals?.map(
                                                                (approval) => (
                                                                    <div
                                                                        key={
                                                                            approval.id
                                                                        }
                                                                        className="flex gap-2"
                                                                    >
                                                                        <span className="font-medium">
                                                                            {
                                                                                approval.level
                                                                            }
                                                                            :
                                                                        </span>
                                                                        <span
                                                                            className={`font-semibold ${
                                                                                approval.status ===
                                                                                "approved"
                                                                                    ? "text-green-600"
                                                                                    : approval.status ===
                                                                                        "pending"
                                                                                      ? "text-orange-600"
                                                                                      : approval.status ===
                                                                                          "rejected"
                                                                                        ? "text-red-600"
                                                                                        : approval.status ===
                                                                                            "waiting"
                                                                                          ? "text-blue-600"
                                                                                          : "text-gray-600"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                approval.status
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            {" "}
                                                                            {
                                                                                approval.approved_at
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                tko.approvals?.find(
                                                                    (
                                                                        approval,
                                                                    ) =>
                                                                        approval.status ===
                                                                        "rejected",
                                                                )?.remarks
                                                            }
                                                        </td>
                                                        <td>
                                                            {tko.tko_count >=
                                                            3 ? (
                                                                <span className="text-red-600 font-semibold">
                                                                    Limit
                                                                    Reached
                                                                    (3/3)
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    {
                                                                        tko.tko_count
                                                                    }
                                                                    /3
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-2 flex text-nowrap">
                                                            {tko.employee_by
                                                                ?.employee_id ===
                                                                auth.user
                                                                    .employee_id &&
                                                                !tko.approvals?.some(
                                                                    (a) =>
                                                                        a.status ===
                                                                            "approved" ||
                                                                        a.status ===
                                                                            "rejected",
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                tko.id,
                                                                            )
                                                                        }
                                                                        className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                    >
                                                                        <span className="text-green-500">
                                                                            Edit
                                                                        </span>
                                                                    </button>
                                                                )}
                                                        </td>
                                                    </tr>
                                                ))
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
                                        links={tkos && tkos.meta.links}
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
                        user={auth}
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
                        user={auth}
                        tko={selectedTko}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
