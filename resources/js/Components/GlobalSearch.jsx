import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { Search } from "lucide-react";

export default function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState([]);

    // Keyboard shortcut Ctrl+K or Cmd+K
    useEffect(() => {
        const down = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSearch = async (query) => {
        if (!query || query.length < 2) return;

        const res = await fetch(`/search?q=${query}`);
        const data = await res.json();
        setResults(data.results);
    };

    const goTo = (url) => {
        setOpen(false);
        router.visit(url);
    };

    return (
        <>
            {/* OPTIONAL Search Button for UI */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-sm px-3 py-1 border rounded-md 
               hover:bg-gray-100 text-gray-500 w-96 h-10"
            >
                <Search className="w-4 h-4" />
                <span>Search... (Ctrl+K)</span>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="p-4 pb-2">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                        Search Engine...
                    </h2>

                    <CommandInput
                        placeholder="Search Employees, DTR, Activities, Training..."
                        onValueChange={handleSearch}
                    />
                </div>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Search Results">
                        {results.map((item, i) => (
                            <CommandItem
                                key={i}
                                value={item.label}
                                onSelect={() => goTo(item.url)}
                                className="hover:bg-gray-300 text-gray-500 m-2"
                            >
                                <div className="flex flex-col ">
                                    <span>{item.label}</span>
                                    <span className="text-xs opacity-50">
                                        {item.type}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
