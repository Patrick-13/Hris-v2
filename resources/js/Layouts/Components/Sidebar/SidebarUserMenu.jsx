import NavLink from "@/Components/NavLink";
import { useState } from "react";
import { GrUserSettings } from "react-icons/gr";

export default function SidebarUserMenu() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* User Icon */}
            <div className="group flex items-center justify-center w-12 h-12 hover:bg-primary-700 rounded-md cursor-pointer">
                <GrUserSettings
                    size={20}
                    className="text-primary-700 group-hover:text-white"
                />
            </div>

            {/* Slide-out menu on hover */}
            {hovered && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-prim
                ary-700 shadow-lg border rounded-md transition-all duration-300 z-50">
                    <div className="p-4 space-y-2">
                        <NavLink
                            href={route("profile.edit")}
                            className="block px-2 py-1 rounded text-white hover:bg-primary-600 hover:text-white"
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="block px-2 py-1 rounded text-white hover:bg-primary-600 hover:text-white"
                        >
                            Log Out
                        </NavLink>
                    </div>
                </div>
            )}
        </div>
    );
}
