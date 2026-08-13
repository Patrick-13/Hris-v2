import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import axios from "axios";
import { MdHome } from "react-icons/md";

export default function Create({ auth, success }) {
    const { users, modules } = usePage().props;
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user modules when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            axios.get(`/user-modules/${selectedUser}`).then((response) => {
                setSelectedModules(response.data); // Set selected modules from response
            });
        } else {
            setSelectedModules([]); // Clear modules if no user is selected
        }
    }, [selectedUser]);

    // Handle module selection
    const handleModuleChange = (moduleId) => {
        setSelectedModules((prevModules) =>
            prevModules.includes(moduleId)
                ? prevModules.filter((id) => id !== moduleId)
                : [...prevModules, moduleId]
        );
    };

    // Handle saving the selected modules
    const handleSave = () => {
        setLoading(true);
        router.post(
            `/user-modules/${selectedUser}`,
            { module_ids: selectedModules },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center gap-2">
                        <Link
                            href="/"
                            className="hover:text-blue-500 transition"
                        >
                            <MdHome
                                size={32}
                                className="cursor-pointer text-green-700"
                            />
                        </Link>
                        <span>Create New Module</span>
                    </h2>
                </div>
            }
        >
            <Head title="User Module" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-5">
                                <label
                                    htmlFor="user-select"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Select User
                                </label>
                                <SelectInput
                                    id="user-select"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedUser}
                                    onChange={(e) =>
                                        setSelectedUser(e.target.value)
                                    }
                                >
                                    <option value="">Select a User</option>
                                    {users &&
                                        users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                </SelectInput>
                            </div>

                            {selectedUser && (
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Modules
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {modules &&
                                            modules.map((module) => (
                                                <div
                                                    key={module.id}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        id={`module-${module.id}`}
                                                        type="checkbox"
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                        checked={selectedModules.includes(
                                                            module.id
                                                        )}
                                                        onChange={() =>
                                                            handleModuleChange(
                                                                module.id
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`module-${module.id}`}
                                                        className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                                                    >
                                                        {module.name}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className={`px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        loading || !selectedUser
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={handleSave}
                                    disabled={loading || !selectedUser}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
