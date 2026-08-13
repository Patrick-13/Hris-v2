import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import { capitalizeWords } from "@/constant";

export default function Index({
    employeemovements,
    companys,
    personelemployees,
    personeljobs,
    divisions,
    sections,
    positions,
    employeemovementedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const [shown, setShown] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedEmployeeMovement, setSelectedEmployeeMovement] = useState(
        employeemovementedits || null,
    );

    const handleEditClick = async (employeemovementId) => {
        try {
            const response = await axios.get(
                `/admin/employeemovement/${employeemovementId}/edit`,
            );
            setSelectedEmployeeMovement(response.data); // Set the fetched product data
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
            router.get(route("employeemovement.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "employeemovements",
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
        router.get(route("employeemovement.index"), queryParams);
    };

    const deleteEmployeeMovement = (employeemovement) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${employeemovement.employee_id} employee?`,
            )
        ) {
            return;
        }
        router.delete(route("employeemovement.destroy", employeemovement.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Employee Movement
                </h2>
            }
        >
            <Head title="EmployeeMovement" />

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
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <FaPlus size={14} />
                                        <span className="font-medium">New</span>
                                    </button>
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
                                                    sortChanged={sortChanged}
                                                >
                                                    ID
                                                </TableHeading>
                                                <TableHeading
                                                    name="company_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Company Name
                                                </TableHeading>
                                                <TableHeading
                                                    name="employee_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Employee Name
                                                </TableHeading>
                                                <TableHeading
                                                    name="division_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Division
                                                </TableHeading>
                                                <TableHeading
                                                    name="section_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Section
                                                </TableHeading>
                                                <TableHeading
                                                    name="position_id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Position
                                                </TableHeading>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeemovements &&
                                            employeemovements.data.length >
                                                0 ? (
                                                employeemovements.data.map(
                                                    (employeemovement) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={
                                                                employeemovement.id
                                                            }
                                                        >
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeemovement.id
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeemovement
                                                                        .companyBy
                                                                        .name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {`${capitalizeWords(employeemovement.employeeBy?.lastname)}, 
                                                                    ${capitalizeWords(employeemovement.employeeBy?.firstname)} 
                                                                    ${
                                                                        employeemovement
                                                                            .employeeBy
                                                                            ?.middlename
                                                                            ? capitalizeWords(
                                                                                  employeemovement
                                                                                      .employeeBy
                                                                                      .middlename,
                                                                              )[0] +
                                                                              "."
                                                                            : ""
                                                                    }`}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeemovement
                                                                        .divisionBy
                                                                        .div_name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeemovement
                                                                        .sectionBy
                                                                        .sec_name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employeemovement
                                                                        .positionBy
                                                                        .post_name
                                                                }
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            employeemovement.id,
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
                                                                        deleteEmployeeMovement(
                                                                            employeemovement,
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
                                            employeemovements &&
                                            employeemovements.meta.links
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
                        companys={companys}
                        personelemployees={personelemployees}
                        divisions={divisions}
                        sections={sections}
                        positions={positions}
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
                        employeemovements={selectedEmployeeMovement}
                        companys={companys}
                        personeljobs={personeljobs}
                        personelemployees={personelemployees}
                        divisions={divisions}
                        sections={sections}
                        positions={positions}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
