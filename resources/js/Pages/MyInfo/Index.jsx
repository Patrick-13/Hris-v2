import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Main from "./Components/Main";
import Sidebar from "./Components/Sidebar";
import { useState } from "react";

export default function Index({
    auth,
    employeeinfos,
    personnelLeave,
    queryParams = null,
}) {
    console.log(employeeinfos);
    queryParams = queryParams || {};
    const [activeTab, setActiveTab] = useState("personal");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Employee Information
                </h2>
            }
        >
            <Head title="My Info" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Sidebar + Main Content layout */}
                            <div className="flex">
                                {/* Sidebar */}
                                <Sidebar
                                    auth={auth}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />

                                {/* Main Content */}
                                <Main
                                    auth={auth}
                                    employeeinfos={employeeinfos}
                                    personnelLeave={personnelLeave}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
