import React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

const SidebarSearch = ({ allModules, commandOpen, setCommandOpen }) => {
    return (
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <div className="p-4 pb-2">
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                    Quick Search
                </h2>
                <CommandInput
                    placeholder="Search modules..."
                    className="border rounded-md"
                />
            </div>

            <CommandList className="px-4 pb-4">
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Modules" className="space-y-1">
                    {allModules.map((item) => (
                        <CommandItem
                            key={item.name}
                            onSelect={() => {
                                setCommandOpen(false);
                                window.location.href = item.href;
                            }}
                            className="cursor-pointer"
                        >
                            {item.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default SidebarSearch;
