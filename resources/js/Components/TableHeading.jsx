import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";


export default function TableHeading({
    name,
    sortable = true,
    sort_field = null,
    sort_direction = null,
    sortChanged = () => { },
    children,
    darkMode = false, // New prop for dark mode
}) {
    return (
        <th onClick={(e) => sortChanged(name)}>
            <div className="px-3 py-3 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable && (
                    <div className="flex flex-col items-center space-y-1">
                        <FaChevronUp
                            className={
                                "w-4 " +
                                (sort_field === name && sort_direction === "asc"
                                    ? darkMode
                                        ? "text-black"
                                        : "text-gray-300"
                                    : "")
                            }
                        />
                        <FaChevronDown
                            className={
                                "w-4 " +
                                (sort_field === name && sort_direction === "desc"
                                    ? darkMode
                                        ? "text-black"
                                        : "text-gray-500"
                                    : "")
                            }
                        />
                    </div>

                )}
            </div>
        </th>
    );
}
