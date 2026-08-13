import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { SearchBar } from "@/Components/SearchBar";
import Pending from "./Tabs/Pending";
import { onlyMapAro } from "@/constant";
import Waiting from "./Tabs/Waiting";
import Approved from "./Tabs/Approved";
import Resubmitted from "./Tabs/Resubmitted";
import Returned from "./Tabs/Returned";

export default function Index({
    auth,
    personnelaccomplishments,
    personnelaccomplishmentwaiting,
    personnelaccomplishmentapproved,
    personnelaccomplishmentresubmitted,
    personnelaccomplishmentreturned,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
    totalCountwaiting,
    currentPageCountwaiting,
    currentPagewaiting,
    totalCountapproved,
    currentPageCountapproved,
    currentPageapproved,
    totalCountresubmitted,
    currentPageCountresubmitted,
    currentPageresubmitted,
    totalCountreturned,
    currentPageCountreturned,
    currentPagereturned,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const activeTab = queryParams?.tab ?? "pending";

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(
                route("employeeovertimeccomplishment.index"),
                updatedQueryParams,
                {
                    preserveState: true,
                    tab: "pending",
                    only: onlyMapAro[activeTab],
                }
            );
        }, 300);
    };

    const changeTab = (tab) => {
        router.get(
            route("employeeovertimeccomplishment.index"),
            {
                ...queryParams,
                tab,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    ARO Approval
                </h2>
            }
        >
            <Head title="Employee Overtime" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex space-x-8">
                                    <button
                                        onClick={() => changeTab("pending")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "pending"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Pending
                                        <span className="inline-flex ml-2 items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            {totalCount ?? 0}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => changeTab("waiting")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "waiting"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Waiting
                                        <span className="inline-flex ml-2 items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            {totalCountwaiting ?? 0}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => changeTab("approved")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "approved"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Approved
                                        <span className="inline-flex ml-2 items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            {totalCountapproved ?? 0}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => changeTab("returned")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "returned"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Returned
                                        <span className="inline-flex ml-2 items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            {totalCountreturned ?? 0}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => changeTab("resubmitted")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "resubmitted"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Resubmitted
                                        <span className="inline-flex ml-2 items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            {totalCountresubmitted ?? 0}
                                        </span>
                                    </button>
                                </nav>
                            </div>

                            {activeTab === "pending" && (
                                <>
                                    <Pending
                                        auth={auth}
                                        personnelaccomplishments={
                                            personnelaccomplishments
                                        }
                                        queryParams={queryParams}
                                        totalCount={totalCount}
                                        currentPageCount={currentPageCount}
                                        currentPage={currentPage}
                                        toolbar={
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />
                                        }
                                    />
                                </>
                            )}

                            {activeTab === "waiting" && (
                                <>
                                    <Waiting
                                        personnelaccomplishmentwaiting={
                                            personnelaccomplishmentwaiting
                                        }
                                        queryParams={queryParams}
                                        totalCountwaiting={totalCountwaiting}
                                        currentPageCountwaiting={
                                            currentPageCountwaiting
                                        }
                                        currentPagewaiting={currentPagewaiting}
                                        toolbar={
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />
                                        }
                                    />
                                </>
                            )}

                            {activeTab === "approved" && (
                                <>
                                    <Approved
                                        auth={auth}
                                        personnelaccomplishmentapproved={
                                            personnelaccomplishmentapproved
                                        }
                                        queryParams={queryParams}
                                        totalCountapproved={totalCountapproved}
                                        currentPageCountapproved={
                                            currentPageCountapproved
                                        }
                                        currentPageapproved={
                                            currentPageapproved
                                        }
                                        toolbar={
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />
                                        }
                                    />
                                </>
                            )}

                            {activeTab === "returned" && (
                                <>
                                    <Returned
                                        auth={auth}
                                        personnelaccomplishmentreturned={
                                            personnelaccomplishmentreturned
                                        }
                                        queryParams={queryParams}
                                        totalCountreturned={totalCountreturned}
                                        currentPageCountreturned={
                                            currentPageCountreturned
                                        }
                                        currentPagereturned={
                                            currentPagereturned
                                        }
                                        toolbar={
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />
                                        }
                                    />
                                </>
                            )}

                            {activeTab === "resubmitted" && (
                                <>
                                    <Resubmitted
                                        auth={auth}
                                        personnelaccomplishmentresubmitted={
                                            personnelaccomplishmentresubmitted
                                        }
                                        queryParams={queryParams}
                                        totalCountresubmitted={
                                            totalCountresubmitted
                                        }
                                        currentPageCountresubmitted={
                                            currentPageCountresubmitted
                                        }
                                        currentPageresubmitted={
                                            currentPageresubmitted
                                        }
                                        toolbar={
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
