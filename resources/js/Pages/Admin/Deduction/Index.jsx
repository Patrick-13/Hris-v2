import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { CiFilter } from "react-icons/ci";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { capitalizeWords } from "@/constant";
import { SearchBar } from "@/Components/SearchBar";
export default function Index({
    employees,
    deductions,
    deductionedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    console.log(deductions);
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedDeduction, setSelectedDeduction] = useState(
        deductionedits || null,
    );

    const handleEditClick = async (deductionId) => {
        try {
            const response = await axios.get(
                `/admin/deduction/${deductionId}/edit`,
            );
            setSelectedDeduction(response.data); // Set the fetched product data

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
            router.get(route("deduction.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "deductions",
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
        router.get(route("deduction.index"), queryParams);
    };

    const deleteDeduction = (deduction) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${deduction.employee_id} Deduction?`,
            )
        ) {
            return;
        }
        router.delete(route("deduction.destroy", deduction.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Deduction
                </h2>
            }
        >
            <Head title="Deduction" />

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
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="max-w-9xl mx-auto sm:px-6 lg:px-8 bg-emerald-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-emerald-600 flex items-center gap-1"
                                        >
                                            <FaPlus size={14} />
                                            <span>New</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="md:h-[400px] lg:h-[500px] overflow-y-auto">
                                        <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="text-nowrap">
                                                    <TableHeading
                                                        name="employee_id"
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
                                                        Fullname
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="sss"
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
                                                        SSS
                                                    </TableHeading>

                                                    <TableHeading
                                                        name="philhealth"
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
                                                        Phil-Health
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="pagibig"
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
                                                        Pag-ibig
                                                    </TableHeading>

                                                    <TableHeading
                                                        name="tax"
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
                                                        Tax
                                                    </TableHeading>
                                                    <TableHeading
                                                        name="union_fee"
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
                                                        Union
                                                    </TableHeading>

                                                    <th className="px-3 py-2">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deductions &&
                                                deductions.data.length > 0 ? (
                                                    deductions.data.map(
                                                        (deduction) => (
                                                            <tr
                                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                key={
                                                                    deduction.id
                                                                }
                                                            >
                                                                <td className="px-3 py-2">
                                                                    {`${capitalizeWords(deduction.employeeBy?.lastname)}, 
                                                                    ${capitalizeWords(deduction.employeeBy?.firstname)} 
                                                                          ${
                                                                              deduction
                                                                                  .employeeBy
                                                                                  ?.middlename
                                                                                  ? capitalizeWords(
                                                                                        deduction
                                                                                            .employeeBy
                                                                                            .middlename,
                                                                                    )[0] +
                                                                                    "."
                                                                                  : ""
                                                                          }`}
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        deduction.sss
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        deduction.philhealth
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        deduction.pagibig
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        deduction.tax
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        deduction.union_fee
                                                                    }
                                                                </td>

                                                                <td className="px-3 py-2 flex text-nowrap">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                deduction.id,
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
                                                                            deleteDeduction(
                                                                                deduction,
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
                                                deductions &&
                                                deductions.meta.links
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
                            employees={employees}
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
                            employees={employees}
                            deductions={selectedDeduction}
                            closeModal={() => setShowModalEdit(false)}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
