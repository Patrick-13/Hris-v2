import React, { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

export default function UserShow({ auth, user, modules, submodules, buttons }) {
    // State for selected modules
    const [selectedModules, setSelectedModules] = useState(new Set());
    const [selectedSubmodules, setSelectedSubmodules] = useState(new Set());
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [selectedButtons, setSelectedButtons] = useState(new Set());

    useEffect(() => {
        // Initialize selected modules based on user data
        const userModules = new Set(user.modules.map((module) => module.id));
        setSelectedModules(userModules);
    }, [user]);

    useEffect(() => {
        // Initialize selected sub modules based on user data
        const userSubmodules = new Set(
            user.submodules.map((submodule) => submodule.id),
        );
        setSelectedSubmodules(userSubmodules);
    }, [user]);

    useEffect(() => {
        // Initialize selected buttons based on user data
        const userButtons = new Set(user.buttons.map((button) => button.id));
        setSelectedButtons(userButtons);
    }, [user]);

    // Handle module selection
    const handleModuleChange = (moduleId) => {
        setSelectedModules((prev) => {
            const updatedModules = new Set(prev);
            if (updatedModules.has(moduleId)) {
                updatedModules.delete(moduleId);
            } else {
                updatedModules.add(moduleId);
            }
            // Update access with selected modules only
            updateModuleAccess(user.id, Array.from(updatedModules));
            return updatedModules;
        });
    };

    const handleSubmoduleChange = (submoduleId) => {
        setSelectedSubmodules((prev) => {
            const updatedSubmodules = new Set(prev);
            if (updatedSubmodules.has(submoduleId)) {
                updatedSubmodules.delete(submoduleId);
            } else {
                updatedSubmodules.add(submoduleId);
            }
            // Update access with selected modules only
            updateSubmoduleAccess(user.id, Array.from(updatedSubmodules));
            return updatedSubmodules;
        });
    };

    const handleButtonChange = (buttonId) => {
        setSelectedButtons((prev) => {
            const updatedButtons = new Set(prev);
            if (updatedButtons.has(buttonId)) {
                updatedButtons.delete(buttonId);
            } else {
                updatedButtons.add(buttonId);
            }
            // Update access with selected modules only
            updatebuttonAccess(user.id, Array.from(updatedButtons));
            return updatedButtons;
        });
    };

    const updateModuleAccess = (usermoduleId, modulesArray) => {
        router.put(
            route("usermodule.updateModuleAccess", { id: usermoduleId }),
            {
                modules: modulesArray,
            },
        );
    };

    const updateSubmoduleAccess = (usersubmoduleId, submodulesArray) => {
        router.put(
            route("submodule.updateSubmoduleAccess", { id: usersubmoduleId }),
            {
                submodules: submodulesArray,
            },
        );
    };

    const updatebuttonAccess = (userbuttonId, buttonsArray) => {
        router.put(route("button.updatebuttonAccess", { id: userbuttonId }), {
            buttons: buttonsArray,
        });
    };

    const groupedSubmodules = modules.map((module) => ({
        ...module,
        submodules: submodules.filter((sub) => sub.module_id == module.id),
    }));

    const toggleDropdown = (moduleId) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
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
                        ></Link>
                        <span className="text-gray-500">
                            {user.name}'s Module Access
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title={`${user.name}'s Modules`} />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md border dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    Module Access
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedSubmodules.map((module) => {
                                        const hasSubmodules =
                                            module.submodules.length > 0;
                                        const isOpen = openDropdowns[module.id];

                                        return (
                                            <div
                                                key={module.id}
                                                className="bg-gray-200 dark:bg-gray-800 rounded-md shadow p-4 border dark:border-gray-700"
                                            >
                                                {/* MODULE HEADER */}
                                                <div
                                                    className="flex items-center justify-between cursor-pointer"
                                                    onClick={() =>
                                                        hasSubmodules &&
                                                        toggleDropdown(
                                                            module.id,
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {hasSubmodules && (
                                                            <span className="text-gray-500">
                                                                {isOpen ? (
                                                                    <IoChevronDown />
                                                                ) : (
                                                                    <IoChevronForward />
                                                                )}
                                                            </span>
                                                        )}
                                                        <span className="text-base font-semibold">
                                                            {module.moduleName}
                                                        </span>
                                                    </div>

                                                    <TextInput
                                                        type="checkbox"
                                                        checked={selectedModules.has(
                                                            module.id,
                                                        )}
                                                        onChange={(e) => {
                                                            e.stopPropagation(); // prevent dropdown toggle
                                                            handleModuleChange(
                                                                module.id,
                                                            );
                                                        }}
                                                        className="w-4 h-4 accent-blue-600"
                                                    />
                                                </div>

                                                {/* SUBMODULE DROPDOWN */}
                                                {hasSubmodules && isOpen && (
                                                    <div className="mt-3 ml-6 space-y-2">
                                                        {module.submodules.map(
                                                            (submodule) => (
                                                                <div
                                                                    key={
                                                                        submodule.id
                                                                    }
                                                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded"
                                                                >
                                                                    <span>
                                                                        {
                                                                            submodule.submoduleName
                                                                        }
                                                                    </span>

                                                                    <TextInput
                                                                        type="checkbox"
                                                                        checked={selectedSubmodules.has(
                                                                            submodule.id,
                                                                        )}
                                                                        disabled={
                                                                            !selectedModules.has(
                                                                                module.id,
                                                                            )
                                                                        } // DISABLE IF MODULE NOT SELECTED
                                                                        onChange={() =>
                                                                            selectedModules.has(
                                                                                module.id,
                                                                            ) && // Prevent clicking when disabled
                                                                            handleSubmoduleChange(
                                                                                submodule.id,
                                                                            )
                                                                        }
                                                                        className={`w-4 h-4 accent-blue-600 ${
                                                                            !selectedModules.has(
                                                                                module.id,
                                                                            )
                                                                                ? "opacity-40 cursor-not-allowed"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border dark:border-gray-700 mt-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    Priveleges
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                    {buttons.map((button) => (
                                        <div
                                            key={button.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700"
                                        >
                                            <span>{button.buttonName}</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedButtons.has(
                                                    button.id,
                                                )}
                                                onChange={() =>
                                                    handleButtonChange(
                                                        button.id,
                                                    )
                                                }
                                                className="w-4 h-4 accent-blue-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route("usermodule.index")}
                                    className="bg-gray-500 py-2 px-4 text-white rounded shadow hover:bg-gray-600"
                                >
                                    Back to User List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
