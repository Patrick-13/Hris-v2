import { Link } from "@inertiajs/react";

export default function Pagination({
    links,
    darkMode = false,
    totalCount,
    currentPageCount,
    currentPage,
}) {
    // Ensure that links is an array before mapping over it
    if (!Array.isArray(links)) {
        return null;
    }

    // Calculate the total count displayed on the current page
    const displayingCount = currentPageCount * currentPage;

    return (
        <nav
            className={`text-center mt-4 ${
                darkMode ? "text-white" : "text-gray-400"
            }`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-sm text-gray-500">{`Displaying ${displayingCount} out of ${totalCount} entries`}</span>
                </div>
                <div>
                    {links.map((link) => (
                        <Link
                            preserveScroll
                            href={link.url || ""}
                            key={link.label}
                            className={`inline-block py-2 px-3 rounded-lg text-xs ${
                                link.active ? "bg-gray-200" : ""
                            } ${
                                !link.url
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "hover:bg-gray-200"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></Link>
                    ))}
                </div>
                <div>
                    <span className="text-sm text-gray-500"></span>
                </div>
            </div>
        </nav>
    );
}
