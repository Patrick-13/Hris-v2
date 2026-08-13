import TextInput from "@/Components/TextInput";
import React from "react";
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ queryParams, searchFieldChanged }) => {
    return (
        <div className="flex items-center w-[350px]">
            <TextInput
                className="w-full pl-4 pr-10"
                defaultValue={queryParams?.search}
                placeholder="Search your query here..."
                onChange={(e) => searchFieldChanged("search", e.target.value)}
            />
            {/* <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
        </div>
    );
};
