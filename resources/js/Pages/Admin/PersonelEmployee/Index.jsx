import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { FaTrashAlt, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import Import from "./Modal/Import";
import { CiExport, CiImport } from "react-icons/ci";
import { capitalizeWords } from "@/constant";
import SelectInput from "@/Components/SelectInput";
import InputLabel from "@/Components/InputLabel";
import axios from "axios";

export default function Index({
    auth,
    employees,
    offices,
    employeeedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    // console.log(employees);
    queryParams = queryParams || {};
    const exportRef = useRef(null);

    const [showExportMenu, setShowExportMenu] = useState(false);
    const debounceTimeout = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [showModal, setShowModal] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(
        employeeedits || null
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                exportRef.current &&
                !exportRef.current.contains(event.target)
            ) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [selectedIds, setSelectedIds] = useState([]);

    const handleBulkOutSideOffice = () => {
        if (!window.confirm(` ${selectedIds.length} employee(s)?`)) {
            return;
        }

        router.post(
            route("employee.bulk-approve"),
            {
                ids: selectedIds,
                flexi_type: queryParams.flexi_type,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleEditClick = async (employeeId) => {
        try {
            const response = await axios.get(
                `/user/employee/${employeeId}/edit`
            );
            setSelectedEmployee(response.data); // Set the fetched product data
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
            router.get(route("employee.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "employees",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 500); // Wait 1000ms after user stops typing
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
        router.get(route("employee.index"), queryParams);
    };

    const deleteEmployee = (employee) => {
        if (
            !window.confirm(
                `are you sure you want to delete the ${employee.lastname} ', '  ${firstname} employee?`
            )
        ) {
            return;
        }
        router.delete(route("employee.destroy", employee.id));
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("employee.index"), newParams);
    };

    const exportExcel = async () => {
        try {
            const response = await axios.get("/user/employee/export/excel", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "personnel.xlsx");

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        }
    };

    const exportCsv = async () => {
        try {
            const response = await axios.get("/user/employee/export/csv", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "personnel.csv");

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Employee
                </h2>
            }
        >
            <Head title="Employee" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-visible shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-visible">
                                <div className="flex items-center gap-4 mb-5">
                                    {/* Search Input */}
                                    <SearchBar
                                        queryParams={queryParams}
                                        searchFieldChanged={searchFieldChanged}
                                    />
                                    <SelectInput
                                        id="status"
                                        value={queryParams.status || ""}
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Contractual">
                                            Contractual
                                        </option>
                                    </SelectInput>

                                    <SelectInput
                                        id="flexi_type"
                                        value={queryParams.flexi_type || ""}
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "flexi_type",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Flexi Sched.
                                        </option>
                                        <option value="FWA-A">FWA-A</option>
                                        <option value="FWA-B">FWA-B</option>
                                    </SelectInput>

                                    <SelectInput
                                        id="emp_status"
                                        value={queryParams.emp_status || ""}
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "emp_status",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Employee Status
                                        </option>
                                        <option value="0">Active</option>
                                        <option value="1">In-Active</option>
                                    </SelectInput>

                                    <SelectInput
                                        name="province_office"
                                        id="province_office"
                                        value={
                                            queryParams.province_office || ""
                                        }
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "province_office",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Province
                                        </option>
                                        <option value="DC">Davao City</option>
                                        <option value="DDN">
                                            Davao del Norte
                                        </option>
                                        <option value="DDS">
                                            Davao del Sur
                                        </option>
                                        <option value="DOC">
                                            Davao Occidental
                                        </option>
                                        <option value="DDO">
                                            Davao de Oro
                                        </option>
                                        <option value="DO">
                                            Davao Oriental
                                        </option>
                                    </SelectInput>

                                    {/* Add Button */}
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-2 bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <FaPlus size={14} />
                                        <span className="font-medium">New</span>
                                    </button>

                                    <button
                                        onClick={handleBulkOutSideOffice}
                                        className="flex items-center gap-2 bg-blue-500 py-2 px-4 rounded-lg shadow-sm transition-allbg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Bulk Update ({selectedIds.length})
                                    </button>

                                    {/* <button
                                        onClick={() => setShowModalImport(true)}
                                        className="flex items-center gap-2 bg-red-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all"
                                    >
                                        <CiImport size={18} />{" "}
                                        <span>Import</span>
                                    </button> */}
                                    {/* <div className="relative" ref={exportRef}>
                                        <button
                                            onClick={() =>
                                                setShowExportMenu(
                                                    !showExportMenu
                                                )
                                            }
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm"
                                        >
                                            <CiExport size={18} />{" "}
                                            <span>Export</span>
                                        </button>

                                        {showExportMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
                                                <button
                                                    onClick={() => {
                                                        exportExcel();
                                                        setShowExportMenu(
                                                            false
                                                        );
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Export Excel (.xlsx)
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        exportCsv();
                                                        setShowExportMenu(
                                                            false
                                                        );
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Export CSV (.csv)
                                                </button>
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="flex items-center gap-2 mb-2">
                                    <InputLabel
                                        htmlFor="show"
                                        value="Show"
                                        className="text-lg"
                                    />
                                    <SelectInput
                                        id="show"
                                        value={queryParams.per_page}
                                        onChange={handleRowsPerPageChange}
                                        className="w-32"
                                    >
                                        {[10, 20, 50, 100].map((perPage) => (
                                            <option
                                                key={perPage}
                                                value={perPage}
                                            >
                                                {perPage} Rows
                                            </option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div className="md:h-[600px] lg:h-[650px] overflow-y-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) =>
                                                            setSelectedIds(
                                                                e.target.checked
                                                                    ? employees.data.map(
                                                                          (o) =>
                                                                              o.id
                                                                      )
                                                                    : []
                                                            )
                                                        }
                                                        checked={
                                                            employees?.data
                                                                .length > 0 &&
                                                            selectedIds.length ===
                                                                employees.data
                                                                    .length
                                                        }
                                                    />
                                                </th>
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
                                                    Employee Id
                                                </TableHeading>
                                                <TableHeading
                                                    name="lastname"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Fullname
                                                </TableHeading>
                                                <TableHeading
                                                    name="date_of_birth "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Date of Birth
                                                </TableHeading>
                                                <TableHeading
                                                    name="gender "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Gender
                                                </TableHeading>
                                                <TableHeading
                                                    name="civil_status "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Civil Status
                                                </TableHeading>
                                                <TableHeading
                                                    name="employment_status "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Employment Status
                                                </TableHeading>
                                                <TableHeading
                                                    name="flexi_type "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Schedule
                                                </TableHeading>
                                                <TableHeading
                                                    name="in_office "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    In Office?
                                                </TableHeading>
                                                <TableHeading
                                                    name="emp_status "
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Status
                                                </TableHeading>

                                                <th>Device Reg. Status</th>

                                                <th className="px-3 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees &&
                                            employees.data.length > 0 ? (
                                                employees.data.map(
                                                    (employee) => (
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={employee.id}
                                                        >
                                                            <td className="px-3 py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIds.includes(
                                                                        employee.id
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        ) {
                                                                            setSelectedIds(
                                                                                [
                                                                                    ...selectedIds,
                                                                                    employee.id,
                                                                                ]
                                                                            );
                                                                        } else {
                                                                            setSelectedIds(
                                                                                selectedIds.filter(
                                                                                    (
                                                                                        id
                                                                                    ) =>
                                                                                        id !==
                                                                                        employee.id
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employee.employee_id
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {`${capitalizeWords(
                                                                    employee?.lastname
                                                                )}, 
                                                                                                                             ${capitalizeWords(
                                                                                                                                 employee?.firstname
                                                                                                                             )} 
                                                                                                                             ${
                                                                                                                                 employee?.middlename
                                                                                                                                     ? capitalizeWords(
                                                                                                                                           employee?.middlename
                                                                                                                                       )[0] +
                                                                                                                                       "."
                                                                                                                                     : ""
                                                                                                                             }`}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employee.date_of_birth
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employee.gender
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    employee.gender.slice(
                                                                        1
                                                                    )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employee.civil_status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    employee.civil_status.slice(
                                                                        1
                                                                    )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employee.employment_status
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    employee.flexi_type
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employee.in_office ===
                                                                0 ? (
                                                                    <span className="text-green-600 font-medium">
                                                                        Yes
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600 font-medium">
                                                                        No
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {employee.emp_status ===
                                                                0 ? (
                                                                    <span className="text-green-600 font-medium">
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600 font-medium">
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-2">
                                                                {employee
                                                                    .personelDeviceBy
                                                                    ?.employee_iclock !==
                                                                null ? (
                                                                    <span className="text-green-600 font-medium">
                                                                        Registered
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600 font-medium">
                                                                        Not
                                                                        Registered
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-2 flex text-nowrap">
                                                                {auth.user
                                                                    .role ===
                                                                    "admin" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                employee.id
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
                                                                )}

                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        deleteEmployee(
                                                                            employee
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
                                </div>
                                <Pagination
                                    links={employees && employees.meta.links}
                                    totalCount={totalCount}
                                    currentPageCount={currentPageCount}
                                    currentPage={currentPage}
                                />
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
                        auth={auth}
                        offices={offices}
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
                        auth={auth}
                        employees={selectedEmployee}
                        offices={offices}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
                <Modal
                    show={showModalImport}
                    onClose={() => setShowModalImport(false)}
                    closeable={true}
                    maxWidth="3xl" // ← use this to expand the modal
                >
                    <Import closeModal={() => setShowModalImport(false)} />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
