import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import MultiSelectedDropdownEmployee from "@/Components/MultiSelectedDropdownEmployee";

export default function Create({ auth, offices, closeModal }) {
    const { data, setData, post, errors, reset } = useForm({
        employee_id: "",
        lastname: "",
        firstname: "",
        middlename: "",
        nickname: "",
        email: "",
        date_of_birth: "",
        gender: "",
        civil_status: "",
        citizenship: "",
        weight: "",
        height: "",
        bloodtype: "",
        gsis: "",
        pagibig_number: "",
        sss_number: "",
        philhealth_number: "",
        TIN: "",
        date_hired: "",
        emp_status: 0,
        employment_status: "",
        flexi_type: "",
        in_office: 0,
        daily_rate: "",
        account_no: "",
        fundtype: "",
        charging: "",
        province_office: "",
        office_id: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("employee.store"), {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    return (
        <div className="max-h-[100vh] overflow-y-auto px-2">
            <form
                onSubmit={onSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Add Employee
                </h2>
                {/* 1st row */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employee Id
                        </InputLabel>
                        <TextInput
                            name="employee_id"
                            id="employee_id"
                            type="text"
                            value={data.employee_id || ""}
                            onChange={(e) =>
                                setData("employee_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.employee_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Lastname
                        </InputLabel>
                        <TextInput
                            name="lastname"
                            id="lastname"
                            type="text"
                            value={data.lastname || ""}
                            onChange={(e) =>
                                setData("lastname", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.lastname}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>firstname
                        </InputLabel>
                        <TextInput
                            name="firstname"
                            id="firstname"
                            type="text"
                            value={data.firstname || ""}
                            onChange={(e) =>
                                setData("firstname", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.firstname}
                            className="mt-2"
                        />
                    </div>
                </div>
                {/* 2nd row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Middlename
                        </InputLabel>
                        <TextInput
                            name="middlename"
                            id="middlename"
                            type="text"
                            value={data.middlename || ""}
                            onChange={(e) =>
                                setData("middlename", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.middlename}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Nickname
                        </InputLabel>
                        <TextInput
                            name="nickname"
                            id="nickname"
                            type="text"
                            value={data.nickname || ""}
                            onChange={(e) =>
                                setData("nickname", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.nickname}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Email
                        </InputLabel>
                        <TextInput
                            name="email"
                            id="email"
                            type="email"
                            value={data.email || ""}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                </div>

                {/* 3rd row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Date of Birth
                        </InputLabel>
                        <TextInput
                            name="date_of_birth"
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth || ""}
                            onChange={(e) =>
                                setData("date_of_birth", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.date_of_birth}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>gender
                        </InputLabel>
                        <SelectInput
                            name="gender"
                            id="gender"
                            type="text"
                            value={data.gender || ""}
                            onChange={(e) => setData("gender", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </SelectInput>
                        <InputError message={errors.gender} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Civil Status
                        </InputLabel>
                        <SelectInput
                            name="civil_status"
                            id="civil_status"
                            type="text"
                            value={data.civil_status || ""}
                            onChange={(e) =>
                                setData("civil_status", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Civil Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </SelectInput>
                        <InputError
                            message={errors.civil_status}
                            className="mt-2"
                        />
                    </div>
                </div>
                {/* 4th row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Citizenship
                        </InputLabel>
                        <TextInput
                            name="citizenship"
                            id="citizenship"
                            type="text"
                            value={data.citizenship || ""}
                            onChange={(e) =>
                                setData("citizenship", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.citizenship}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Weight
                        </InputLabel>
                        <TextInput
                            name="weight"
                            id="weight"
                            type="text"
                            value={data.weight || ""}
                            onChange={(e) => setData("weight", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.weight} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Height
                        </InputLabel>
                        <TextInput
                            name="height"
                            id="height"
                            type="text"
                            value={data.height || ""}
                            onChange={(e) => setData("height", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.height} className="mt-2" />
                    </div>
                </div>
                {/* 5th row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Blood Type
                        </InputLabel>
                        <TextInput
                            name="bloodtype"
                            id="bloodtype"
                            type="text"
                            value={data.bloodtype || ""}
                            onChange={(e) =>
                                setData("bloodtype", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.bloodtype}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>GSIS
                        </InputLabel>
                        <TextInput
                            name="gsis"
                            id="gsis"
                            type="text"
                            value={data.gsis || ""}
                            onChange={(e) => setData("gsis", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.gsis} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Pag-ibig
                        </InputLabel>
                        <TextInput
                            name="pagibig_number"
                            id="pagibig_number"
                            type="text"
                            value={data.pagibig_number || ""}
                            onChange={(e) =>
                                setData("pagibig_number", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.pagibig_number}
                            className="mt-2"
                        />
                    </div>
                </div>
                {/* 6th row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>SSS
                        </InputLabel>
                        <TextInput
                            name="sss_number"
                            id="sss_number"
                            type="text"
                            value={data.sss_number || ""}
                            onChange={(e) =>
                                setData("sss_number", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.sss_number}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Philhealth
                        </InputLabel>
                        <TextInput
                            name="philhealth_number"
                            id="philhealth_number"
                            type="text"
                            value={data.philhealth_number || ""}
                            onChange={(e) =>
                                setData("philhealth_number", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.philhealth_number}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>TIN No.
                        </InputLabel>
                        <TextInput
                            name="TIN"
                            id="TIN"
                            type="text"
                            value={data.TIN || ""}
                            onChange={(e) => setData("TIN", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError message={errors.TIN} className="mt-2" />
                    </div>
                </div>
                {/* 7th row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Appointment
                            Date
                        </InputLabel>
                        <TextInput
                            name="date_hired"
                            id="date_hired"
                            type="date"
                            value={data.date_hired || ""}
                            onChange={(e) =>
                                setData("date_hired", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        <InputError
                            message={errors.date_hired}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Employment
                            Status
                        </InputLabel>
                        <SelectInput
                            name="employment_status"
                            id="employment_status"
                            type="text"
                            value={data.employment_status || ""}
                            onChange={(e) =>
                                setData("employment_status", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Status</option>
                            <option value="Regular">Regular</option>
                            <option value="Trainee">Trainee</option>
                            <option value="Contractual">Contractual</option>
                            <option value="Job Order">Job Order</option>
                            <option value="Permanent">Permanent</option>
                            <option value="Summber Job">Summer Job</option>
                        </SelectInput>
                        <InputError
                            message={errors.employment_status}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Status
                        </InputLabel>
                        <SelectInput
                            name="emp_status"
                            id="emp_status"
                            type="text"
                            value={data.emp_status}
                            onChange={(e) =>
                                setData("emp_status", Number(e.target.value))
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Status</option>
                            <option value={0}>Active</option>
                            <option value={1}>In-Active</option>
                        </SelectInput>
                        <InputError
                            message={errors.emp_status}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span>Sched. Type
                        </InputLabel>
                        <SelectInput
                            name="flexi_type"
                            id="flexi_type"
                            type="text"
                            value={data.flexi_type || ""}
                            onChange={(e) =>
                                setData("flexi_type", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Sched. Type</option>
                            <option value="FWA-A">FWA-A</option>
                            <option value="FWB-B">FWB-B</option>
                        </SelectInput>
                        <InputError
                            message={errors.flexi_type}
                            className="mt-2"
                        />
                    </div>
                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>In
                                Office?
                            </InputLabel>
                            <SelectInput
                                name="in_office"
                                id="in_office"
                                type="text"
                                value={data.in_office || ""}
                                onChange={(e) =>
                                    setData("in_office", Number(e.target.value))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">-Select-</option>
                                <option value={0}>Yes</option>
                                <option value={1}>No</option>
                            </SelectInput>
                            <InputError
                                message={errors.in_office}
                                className="mt-2"
                            />
                        </div>
                    )}

                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Monthly
                                Rate
                            </InputLabel>
                            <TextInput
                                name="daily_rate"
                                id="daily_rate"
                                type="text"
                                value={data.daily_rate || ""}
                                onChange={(e) =>
                                    setData("daily_rate", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.daily_rate}
                                className="mt-2"
                            />
                        </div>
                    )}

                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Account
                                No
                            </InputLabel>
                            <TextInput
                                name="account_no"
                                id="account_no"
                                type="text"
                                value={data.account_no || ""}
                                onChange={(e) =>
                                    setData("account_no", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.account_no}
                                className="mt-2"
                            />
                        </div>
                    )}

                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Fund Type
                            </InputLabel>
                            <SelectInput
                                name="fundtype"
                                id="fundtype"
                                type="text"
                                value={data.fundtype || ""}
                                onChange={(e) =>
                                    setData("fundtype", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">-Select-</option>
                                <option value="Regular Fund">
                                    Regular Fund
                                </option>
                                <option value="Regular Fund Enmo">
                                    Regular Fund Enmo
                                </option>
                                <option value="ERF">ERF</option>
                                <option value="PMCC">PMCC</option>
                            </SelectInput>
                            <InputError
                                message={errors.fundtype}
                                className="mt-2"
                            />
                        </div>
                    )}
                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Charging
                            </InputLabel>
                            <TextInput
                                name="charging"
                                id="charging"
                                type="text"
                                value={data.charging || ""}
                                onChange={(e) =>
                                    setData("charging", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            <InputError
                                message={errors.charging}
                                className="mt-2"
                            />
                        </div>
                    )}
                    {auth.user.role === "admin" && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span>Province
                                Office
                            </InputLabel>
                            <SelectInput
                                name="province_office"
                                id="province_office"
                                type="text"
                                value={data.province_office || ""}
                                onChange={(e) =>
                                    setData("province_office", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">-Select-</option>
                                <option value="DC">Davao City</option>
                                <option value="DDN">Davao del Norte</option>
                                <option value="DDS">Davao del Sur</option>
                                <option value="DOC">Davao Occidental</option>
                                <option value="DDO">Davao de Oro</option>
                                <option value="DO">Davao Oriental</option>
                            </SelectInput>
                            <InputError
                                message={errors.province_office}
                                className="mt-2"
                            />
                        </div>
                    )}

                    {auth.user.role === "admin" && (
                        <div className="sm:col-span-2 lg:col-span-2">
                            <InputLabel className="block text-sm font-medium text-gray-700">
                                <span className="text-red-500">*</span> Office
                                Name
                            </InputLabel>
                            <MultiSelectedDropdownEmployee
                                name="office_id"
                                value={data.office_id}
                                onChange={(values) =>
                                    setData("office_id", values)
                                }
                            >
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.office_name}
                                    </option>
                                ))}
                            </MultiSelectedDropdownEmployee>

                            <InputError
                                message={errors.office_id}
                                className="mt-2"
                            />
                        </div>
                    )}
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
        </div>
    );
}
