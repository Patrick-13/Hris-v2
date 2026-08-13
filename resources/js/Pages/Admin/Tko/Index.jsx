import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
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
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModalApprove, setShowModalApprove] = useState(false);
    const [selectedTko, setSelectedTko] = useState(tkoedits || null);

    const handleApproveClick = async (tkoId) => {
        try {
            const response = await axios.get(`/tko/${tkoId}`);
            setSelectedTko(response.data);
            setShowModalApprove(true);
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

            console.log("Updated Query Params:", updatedQueryParams);
            router.get(route("admintko.index"), updatedQueryParams, {
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
        router.get(route("admintko.index"), queryParams);
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
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="md:h-[700px] lg:h-[700px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th>Employee Name</th>
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
                                                <th>Approval Remarks</th>
                                                <th>Tko Count</th>

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
                                                            {`${tko.employee_by?.lastname ?? ""}, ${tko.employee_by?.firstname ?? ""}${
                                                                tko.employee_by
                                                                    ?.middlename
                                                                    ? ` ${tko.employee_by.middlename[0]}.`
                                                                    : ""
                                                            }`}
                                                        </td>
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
                                                                href={`/tko/${encodeURIComponent(
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
                                                            {tko.approvals?.some(
                                                                (a) =>
                                                                    a.approver_id ==
                                                                        auth
                                                                            .user
                                                                            .employee_id &&
                                                                    a.status ===
                                                                        "pending", // 👈 hide button if already approved
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleApproveClick(
                                                                            tko.id,
                                                                        )
                                                                    }
                                                                    className="font-medium text-blue dark:text-blue-500 hover:underline mx-1"
                                                                >
                                                                    <span className="text-blue-500">
                                                                        Approve
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
                    show={showModalApprove}
                    onClose={() => setShowModalApprove(false)}
                    closeable={true}
                    maxWidth="4xl" // ← use this to expand the modal
                >
                    <Approve
                        tko={selectedTko}
                        closeModal={() => setShowModalApprove(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
