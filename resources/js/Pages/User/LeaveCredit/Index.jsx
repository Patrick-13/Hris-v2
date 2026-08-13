import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FaDownload } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import { SearchBar } from "@/Components/SearchBar";
import Credit from "./Tab/Credit";
import Logs from "./Tab/Logs";
export default function Index({
    auth,
    employees,
    leavetypes,
    leavecreditlogs,
    leavecredits,
    leavecreditedits,
    queryParams = null,
    totalCount,
    currentPageCount,
    currentPage,
    logstotalCount,
    logscurrentPageCount,
    logscurrentPage,
}) {
    console.log(leavecreditlogs);
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);
    const [activeTab, setActiveTab] = useState("credit");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedLeaveCredit, setSelectedLeaveCredit] = useState(
        leavecreditedits || null
    );

    const loggedInEmployee = employees.find(
        (employee) => employee.employee_id === auth.user.employee_id
    );

    const employeeId = auth.user.employee_id;

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("leavecredit.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "leavecredits",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 300); // Wait 1000ms after user stops typing
    };

    const handleDownloadLeaveCard = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/user/export-leavecard", {
                params: {
                    search: employeeId, // or whatever variable contains the employee id
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.download = "Leave_Card.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Credit
                </h2>
            }
        >
            <Head title="Leave Credit" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab("credit")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "credit"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Credit
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("logs")}
                                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                                            activeTab === "logs"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Logs
                                    </button>
                                </nav>
                            </div>
                            {activeTab === "credit" && (
                                <Credit
                                    leavecredits={leavecredits}
                                    queryParams={queryParams}
                                    totalCount={totalCount}
                                    currentPageCount={currentPageCount}
                                    currentPage={currentPage}
                                />
                            )}
                            {activeTab === "logs" && (
                                <>
                                    <div className="overflow-auto">
                                        <div className="flex items-center gap-4 mb-5">
                                            {/* Search Input */}
                                            <SearchBar
                                                queryParams={queryParams}
                                                searchFieldChanged={
                                                    searchFieldChanged
                                                }
                                            />

                                            {loggedInEmployee?.employment_status ===
                                                "Regular" && (
                                                <button
                                                    className="flex items-center gap-2 bg-orange-500 py-2 px-4 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-all"
                                                    onClick={
                                                        handleDownloadLeaveCard
                                                    }
                                                    disabled={loading}
                                                >
                                                    <FaDownload size={16} />
                                                    Download Leave Card
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Logs
                                        leavecreditlogs={leavecreditlogs}
                                        logstotalCount={logstotalCount}
                                        logscurrentPageCount={
                                            logscurrentPageCount
                                        }
                                        logscurrentPage={logscurrentPage}
                                        queryParams={queryParams}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    closeable={true}
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Create
                        employees={employees}
                        leavetypes={leavetypes}
                        closeModal={() => setShowModal(false)}
                    />
                </Modal>

                <Modal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    closeable={true}
                    maxWidth="2xl" // ← use this to expand the modal
                >
                    <Edit
                        employees={employees}
                        leavetypes={leavetypes}
                        leavecredits={selectedLeaveCredit}
                        closeModal={() => setShowModalEdit(false)}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
