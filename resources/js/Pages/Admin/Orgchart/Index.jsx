import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaArrowAltCircleRight, FaArrowCircleDown } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa";

export default function Index({ divisions }) {
    const [data, setData] = useState(divisions);

    useEffect(() => {
        setData(divisions);
    }, [divisions]);

    function DivisionItem({ division }) {
        const [open, setOpen] = useState(false);

        return (
            <li>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center w-full text-left font-semibold text-blue-600"
                >
                    {open ? (
                        <FaArrowCircleDown size={16} />
                    ) : (
                        <FaArrowAltCircleRight size={16} />
                    )}
                    <span className="ml-1">{division.div_name}</span>
                </button>
                {open && (
                    <ul className="ml-6 mt-2 space-y-1">
                        {division.employee_by && (
                            <div className="inline-flex items-center px-4 py-2 mt-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                                👤 Division Chief:{" "}
                                {division.employee_by.firstname}{" "}
                                {division.employee_by.lastname}
                            </div>
                        )}

                        {division.sections.map((section) => (
                            <SectionItem key={section.id} section={section} />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    function SectionItem({ section }) {
        const [open, setOpen] = useState(false);

        return (
            <li>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center w-full text-left text-green-600"
                >
                    {open ? (
                        <FaArrowCircleDown size={14} />
                    ) : (
                        <FaArrowAltCircleRight size={14} />
                    )}
                    <span className="ml-1">{section.sec_name}</span>
                </button>
                {open && (
                    <ul className="ml-6 mt-1 space-y-1">
                        {section.positions.map((pos) => (
                            <PositionItem key={pos.id} position={pos} />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    function PositionItem({ position }) {
        const [open, setOpen] = useState(false);

        return (
            <li>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center w-full text-left text-purple-600"
                >
                    {open ? (
                        <FaArrowCircleDown size={12} />
                    ) : (
                        <FaArrowAltCircleRight size={12} />
                    )}
                    <span className="ml-1">{position.post_name}</span>
                </button>
                {open && (
                    <ul className="ml-6 mt-1 list-disc">
                        {position.movements.map((movement) => (
                            <li
                                key={movement.employee_id}
                                className="text-gray-700"
                            >
                                {movement.employee_by.firstname}{" "}
                                {movement.employee_by.lastname}
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Org Chart
                </h2>
            }
        >
            <Head title="Org Chart" />

            <div className="py-2">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <h2 className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                    <FaSitemap className="mr-2 text-blue-600" />
                                    Employee Hierarchy
                                </h2>

                                <ul className="space-y-2">
                                    {data.map((division) => (
                                        <DivisionItem
                                            key={division.id}
                                            division={division}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
