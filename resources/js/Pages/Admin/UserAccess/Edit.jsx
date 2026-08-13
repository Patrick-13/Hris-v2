import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import TableHeading from "@/Components/TableHeading";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MdHome } from "react-icons/md";

export default function Index({ auth, users, modules, success }) {
    const [selectedModules, setSelectedModules] = useState({});

    const handleModuleChange = (userId, moduleId) => {
        setSelectedModules((prev) => {
            const userModules = prev[userId] || new Set();
            if (userModules.has(moduleId)) {
                userModules.delete(moduleId);
            } else {
                userModules.add(moduleId);
            }
            return { ...prev, [userId]: userModules };
        });
    };

    const updateAccess = (userId) => {
        const modulesArray = Array.from(selectedModules[userId] || []);
        router.put(route("user.updateAccess", userId), {
            modules: modulesArray,
        });
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
                        <span>User Modules</span>
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
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg darkMode ? 'dark' : ''">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="relative flex flex-col gap-4 mb-5">
                                <div className="overflow-auto">
                                    <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <TableHeading name="id">
                                                    ID
                                                </TableHeading>
                                                <TableHeading name="username">
                                                    Username
                                                </TableHeading>
                                                {modules.map((module) => (
                                                    <TableHeading
                                                        key={module.id}
                                                        name={module.name.toLowerCase()}
                                                    >
                                                        {module.name}
                                                    </TableHeading>
                                                ))}
                                                <TableHeading>
                                                    Actions
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={user.id}
                                                >
                                                    <td className="px-3 py-2">
                                                        {user.id}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {user.name}
                                                    </td>
                                                    {modules.map((module) => (
                                                        <td
                                                            key={module.id}
                                                            className="px-3 py-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={(
                                                                    selectedModules[
                                                                        user.id
                                                                    ] ||
                                                                    new Set()
                                                                ).has(
                                                                    module.id
                                                                )}
                                                                onChange={() =>
                                                                    handleModuleChange(
                                                                        user.id,
                                                                        module.id
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="px-3 py-2">
                                                        <button
                                                            onClick={() =>
                                                                updateAccess(
                                                                    user.id
                                                                )
                                                            }
                                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Update
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
