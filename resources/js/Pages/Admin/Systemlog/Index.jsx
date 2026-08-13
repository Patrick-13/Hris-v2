import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import { SearchBar } from "@/Components/SearchBar";
import { useRef } from "react";

export default function Index({
    auth,
    loginlogs,
    queryParams = null,
    success,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    queryParams = queryParams || {};
    const debounceTimeout = useRef(null);

    console.log(loginlogs);

    const searchFieldChanged = (field, value) => {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const updatedQueryParams = { ...queryParams };
            if (value) {
                updatedQueryParams[field] = value;
            } else {
                delete updatedQueryParams[field];
            }
            router.get(route("userloginlog.index"), updatedQueryParams, {
                preserveState: true,
                only: [
                    "loginlogs",
                    "queryParams",
                    "totalCount",
                    "currentPageCount",
                    "currentPage",
                ],
            });
        }, 500); // Wait 1000ms after user stops typing
    };

    const sortChanged = (agency_name) => {
        if (agency_name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = agency_name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("userloginlog.index"), queryParams);
    };

    const handleRowsPerPageChange = (e) => {
        const rowsPerPage = parseInt(e.target.value);
        const newParams = { ...queryParams, per_page: rowsPerPage };
        router.get(route("userloginlog.index"), newParams);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Login Logs
                    </h2>
                </div>
            }
        >
            <Head title="loginlogs" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg darkMode ? 'dark' : ''">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="relative flex flex-col gap-4 mb-5">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="relative flex items-center gap-2">
                                        <SearchBar
                                            queryParams={queryParams}
                                            searchFieldChanged={
                                                searchFieldChanged
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2 flex flex-wrap items-center justify-center sm:justify-start">
                                <InputLabel
                                    htmlFor="show"
                                    value="Show"
                                    className="w-full sm:w-auto mb-2 sm:mb-0 sm:ml-2 text-lg"
                                />
                                <SelectInput
                                    className="w-full sm:w-auto mb-2 sm:mb-0 sm:ml-2"
                                    value={queryParams.per_page}
                                    onChange={handleRowsPerPageChange}
                                >
                                    {[10, 20, 50, 100].map((perPage) => (
                                        <option key={perPage} value={perPage}>
                                            {perPage} Rows
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                            <table className="w-full text-sm text-left trl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <TableHeading
                                            name="user_id"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            User Id
                                        </TableHeading>
                                        <TableHeading
                                            name="user_email"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            User Email
                                        </TableHeading>
                                        <TableHeading
                                            name="user_ip"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            User IP
                                        </TableHeading>
                                        <TableHeading
                                            name="action"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Action
                                        </TableHeading>
                                        <TableHeading
                                            name="created_at"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            DateTime
                                        </TableHeading>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loginlogs.data.map((loginlog) => (
                                        <tr
                                            className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700"
                                            key={loginlog.id}
                                        >
                                            <td className="px-3 py-2">
                                                {loginlog.user_id}
                                            </td>
                                            <td className="px-3 py-2">
                                                {loginlog.user_email}
                                            </td>
                                            <td className="px-3 py-2">
                                                {loginlog.user_ip}
                                            </td>
                                            <td className="px-3 py-2">
                                                {loginlog.action}
                                            </td>
                                            <td className="px-3 py-2">
                                                {loginlog.created_at
                                                    ? new Date(
                                                          loginlog.created_at,
                                                      ).toLocaleString(
                                                          "en-US",
                                                          {
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                              year: "numeric",
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                              hour12: false, // 24-hour format (HH:mm)
                                                          },
                                                      )
                                                    : ""}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination
                                links={loginlogs.meta.links}
                                totalCount={totalCount}
                                currentPageCount={currentPageCount}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
