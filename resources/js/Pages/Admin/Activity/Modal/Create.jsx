import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import { useRef, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { SearchBar } from "@/Components/SearchBar";

export default function Create({
    activityemployees,
    activityypes,
    divisions,
    sections,
    queryParams = null,
    closeModal,
}) {
    const { data, setData, post, errors, reset } = useForm({
        title_id: "",
        soNumber: "",
        dateFrom: "",
        dateTo: "",
        noofHours: "",
        type: "",
        venue: "",
        description: "",
        with_coc: false,
        employees: [],
        division_id: "",
        section_id: "",
        status: "",
    });

    const employeesList = activityemployees?.data || activityemployees || [];
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const debounceTimeout = useRef(null);

    const filteredSections = sections.filter(
        (section) => section.div_id == data.division_id,
    );

    const handleCheckboxChange = (employeeId) => {
        setSelectedEmployees((prev) => {
            const newSelected = prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId];
            setData("employees", newSelected); // ✅ keep form data in sync
            return newSelected;
        });
    };

    const handleSelectAllChange = () => {
        if (selectedEmployees.length === employeesList.length) {
            setSelectedEmployees([]);
            setData("employees", []);
        } else {
            const allIds = employeesList.map((e) => e.employee_id);
            setSelectedEmployees(allIds);
            setData("employees", allIds);
        }
    };

    const searchFieldEmployee = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("activity.index"), updatedQueryParams, {
                preserveState: true,
                only: ["activityemployees", "queryParams"],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const selectedActivityType = activityypes?.find(
        (activitytype) => activitytype.id == data.title_id,
    );

    const onSubmit = (e) => {
        e.preventDefault();
        setData("employees", selectedEmployees);
        post(route("activity.store"), {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <>
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-2xl font-semibold">Add Activity</h2>
            </div>
            <form
                onSubmit={onSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
            >
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>
                            {selectedActivityType?.name?.toLowerCase() ===
                            "trip ticket"
                                ? "T.T #"
                                : "S.O #"}
                        </InputLabel>

                        <TextInput
                            name="soNumber"
                            id="soNumber"
                            type="text"
                            value={data.soNumber || ""}
                            onChange={(e) =>
                                setData("soNumber", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />

                        <InputError
                            message={errors.soNumber}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Activity Type
                        </InputLabel>
                        <SelectInput
                            name="title_id"
                            id="title_id"
                            type="text"
                            value={data.title_id || ""}
                            onChange={(e) =>
                                setData("title_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Activity Type</option>
                            {activityypes &&
                                activityypes.map((activitytype) => (
                                    <option
                                        key={activitytype.id}
                                        value={activitytype.id}
                                    >
                                        {activitytype.name}
                                    </option>
                                ))}
                        </SelectInput>
                        <InputError
                            message={errors.title_id}
                            className="mt-2"
                        />
                    </div>

                    {selectedActivityType && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>With COC?
                            </InputLabel>

                            <SelectInput
                                name="with_coc"
                                id="with_coc"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={
                                    data.with_coc === null
                                        ? ""
                                        : data.with_coc
                                          ? "true"
                                          : "false"
                                }
                                onChange={(e) =>
                                    setData(
                                        "with_coc",
                                        e.target.value === "true",
                                    )
                                }
                            >
                                <option value="">Select Option</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </SelectInput>
                            <InputError
                                message={errors.with_coc}
                                className="mt-2"
                            />
                        </div>
                    )}

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Type
                        </InputLabel>
                        <SelectInput
                            name="type"
                            id="type"
                            value={data.type || ""}
                            onChange={(e) => setData("type", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Tyte</option>
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                        </SelectInput>
                        <InputError message={errors.type} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>No of Hours
                        </InputLabel>
                        <TextInput
                            name="noofHours"
                            id="noofHours"
                            type="text"
                            value={data.noofHours || ""}
                            onChange={(e) =>
                                setData("noofHours", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.noofHours}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date From
                        </InputLabel>
                        <TextInput
                            name="dateFrom"
                            id="dateFrom"
                            type="date"
                            value={data.dateFrom || ""}
                            onChange={(e) =>
                                setData("dateFrom", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.dateFrom}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date To
                        </InputLabel>
                        <TextInput
                            name="dateTo"
                            id="dateTo"
                            type="date"
                            value={data.dateTo || ""}
                            onChange={(e) => setData("dateTo", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.dateTo} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Venue
                        </InputLabel>
                        <TextInput
                            name="venue"
                            id="venue"
                            type="text"
                            value={data.venue || ""}
                            onChange={(e) => setData("venue", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.venue} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Description
                        </InputLabel>
                        <TextInput
                            name="description"
                            id="description"
                            type="text"
                            value={data.description || ""}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-[10px]">
                    <SearchBar
                        queryParams={queryParams}
                        searchFieldChanged={searchFieldEmployee}
                    />

                    <SelectInput
                        name="division_id"
                        id="division_id"
                        value={data.division_id || ""}
                        onChange={(e) => {
                            setData("division_id", e.target.value);
                            setData("section_id", "");

                            router.get(
                                route("activity.index"),
                                {
                                    ...queryParams,
                                    division_id: e.target.value,
                                    section_id: "",
                                    search: queryParams?.search || "",
                                },
                                {
                                    preserveState: true,
                                    only: ["activityemployees", "queryParams"],
                                },
                            );
                        }}
                        className="border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Division</option>
                        {divisions?.map((division) => (
                            <option key={division.id} value={division.id}>
                                {division.div_name}
                            </option>
                        ))}
                    </SelectInput>

                    <SelectInput
                        name="section_id"
                        id="section_id"
                        value={data.section_id || ""}
                        onChange={(e) => {
                            setData("section_id", e.target.value);

                            router.get(
                                route("activity.index"),
                                {
                                    ...queryParams,
                                    division_id: data.division_id,
                                    section_id: e.target.value,
                                    search: queryParams?.search || "",
                                },
                                {
                                    preserveState: true,
                                    only: ["activityemployees", "queryParams"],
                                },
                            );
                        }}
                        className="border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Section</option>
                        {filteredSections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.sec_name}
                            </option>
                        ))}
                    </SelectInput>

                    <SelectInput
                        id="status"
                        value={data.status || ""}
                        onChange={(e) => {
                            setData("status", e.target.value);

                            router.get(
                                route("activity.index"),
                                {
                                    ...queryParams,
                                    status: e.target.value,
                                    search: queryParams?.search || "",
                                },
                                {
                                    preserveState: true,
                                    only: ["activityemployees", "queryParams"],
                                },
                            );
                        }}
                    >
                        <option value="">Select Status</option>
                        <option value="Regular">Regular</option>
                        <option value="Contractual">Contractual</option>
                    </SelectInput>
                </div>

                {/* Employees Selection */}
                <div className="flex mt-4 gap-4">
                    <div
                        className="w-1/2 overflow-y-auto"
                        style={{ maxHeight: "400px" }}
                    >
                        <table className="w-full text-sm text-gray-500 mb-4">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr className="text-center">
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAllChange}
                                            checked={
                                                employeesList.length > 0 &&
                                                selectedEmployees.length ===
                                                    employeesList.length
                                            }
                                        />
                                    </th>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeesList.map((employee) => (
                                    <tr
                                        key={employee.employee_id}
                                        className="bg-white border-b"
                                    >
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.includes(
                                                    employee.employee_id,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        employee.employee_id,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>{employee.employee_id}</td>
                                        <td>
                                            {employee.lastname},{" "}
                                            {employee.firstname}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Right: Selected employees */}
                    <div className="p-2 text-sm bg-gray-50"></div>
                    <div
                        className="w-1/2 overflow-y-auto"
                        style={{ maxHeight: "400px" }}
                    >
                        <table className="w-full text-sm text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr className="text-center">
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeesList
                                    .filter((e) =>
                                        selectedEmployees.includes(
                                            e.employee_id,
                                        ),
                                    )
                                    .map((employee) => (
                                        <tr
                                            key={employee.employee_id}
                                            className="bg-white border-b"
                                        >
                                            <td>{employee.employee_id}</td>
                                            <td>{employee.firstname}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <tfoot> Selected: {selectedEmployees.length}</tfoot>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
}
