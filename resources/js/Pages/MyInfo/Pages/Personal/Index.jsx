import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useState } from "react";

export default function Index({
    employeeinfos,
    employeeinfoedits,
    queryParams = null,
}) {
    queryParams = queryParams || {};

    // Initialize state from props
    const [data, setData] = useState(() => {
        const employee = employeeinfos?.data?.[0] || {};
        return {
            employee_id: employee.employee_id || "",
            firstname: employee.firstname || "",
            lastname: employee.lastname || "",
            middlename: employee.middlename || "",
            nickname: employee.nickname || "",
            date_of_birth: employee.date_of_birth || "",
            gender: employee.gender || "",
            civil_status: employee.civil_status || "",
            citizenship: employee.citizenship || "",
            weight: employee.weight || "",
            height: employee.height || "",
            bloodtype: employee.bloodtype || "",
            gsis: employee.gsis || "",
            pagibig_number: employee.pagibig_number || "",
            sss_number: employee.sss_number || "",
            philhealth_number: employee.philhealth_number || "",
            date_hired: employee.date_hired || "",
            employment_status: employee.employment_status || "",
            flexi_type: employee.flexi_type || "",
        };
    });

    return (
        <div className="w-120 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
            {/* Profile Upload */}
            <div className="relative mb-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Employee ID */}
                    <div>
                        <InputLabel>Employee Id</InputLabel>
                        <TextInput
                            name="employee_id"
                            id="employee_id"
                            type="text"
                            value={data.employee_id}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    employee_id: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>

                    {/* Lastname */}
                    <div>
                        <InputLabel>Lastname</InputLabel>
                        <TextInput
                            name="lastname"
                            id="lastname"
                            type="text"
                            value={data.lastname}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    lastname: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>

                    {/* Firstname */}
                    <div>
                        <InputLabel>Firstname</InputLabel>
                        <TextInput
                            name="firstname"
                            id="firstname"
                            type="text"
                            value={data.firstname}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    firstname: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    {/* MiddleName */}
                    <div>
                        <InputLabel>Middlename</InputLabel>
                        <TextInput
                            name="middlename"
                            id="middlename"
                            type="text"
                            value={data.middlename}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    middlename: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Nickname</InputLabel>
                        <TextInput
                            name="nickname"
                            id="nickname"
                            type="text"
                            value={data.nickname}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    nickname: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>DOB</InputLabel>
                        <TextInput
                            name="date_of_birth"
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    date_of_birth: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Gender</InputLabel>
                        <TextInput
                            name="gender"
                            id="gender"
                            type="text"
                            value={data.gender}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    gender: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Civil Status</InputLabel>
                        <TextInput
                            name="civil_status"
                            id="civil_status"
                            type="text"
                            value={data.civil_status}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    civil_status: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Citizenship</InputLabel>
                        <TextInput
                            name="citizenship"
                            id="citizenship"
                            type="text"
                            value={data.citizenship}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    citizenship: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Weight</InputLabel>
                        <TextInput
                            name="weight"
                            id="weight"
                            type="text"
                            value={data.weight}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    weight: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Height</InputLabel>
                        <TextInput
                            name="height"
                            id="height"
                            type="text"
                            value={data.height}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    height: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Blood Type</InputLabel>
                        <TextInput
                            name="bloodtype"
                            id="bloodtype"
                            type="text"
                            value={data.bloodtype}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    bloodtype: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>GSIS</InputLabel>
                        <TextInput
                            name="gsis"
                            id="gsis"
                            type="text"
                            value={data.gsis}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    gsis: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Pagibig-Number</InputLabel>
                        <TextInput
                            name="pagibig_number"
                            id="pagibig_number"
                            type="text"
                            value={data.pagibig_number}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    pagibig_number: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>SSS</InputLabel>
                        <TextInput
                            name="sss_number"
                            id="sss_number"
                            type="text"
                            value={data.sss_number}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    sss_number: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Philhealth Number</InputLabel>
                        <TextInput
                            name="philhealth_number"
                            id="philhealth_number"
                            type="text"
                            value={data.philhealth_number}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    philhealth_number: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Date Hired</InputLabel>
                        <TextInput
                            name="date_hired"
                            id="date_hired"
                            type="date"
                            value={data.date_hired}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    date_hired: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Employment Status</InputLabel>
                        <TextInput
                            name="employment_status"
                            id="employment_status"
                            type="text"
                            value={data.employment_status}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    employment_status: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <InputLabel>Work Arrangement </InputLabel>
                        <TextInput
                            name="flexi_type"
                            id="flexi_type"
                            type="text"
                            value={data.flexi_type}
                            readOnly
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    flexi_type: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
