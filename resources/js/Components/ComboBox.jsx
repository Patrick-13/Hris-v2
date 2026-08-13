import React, { useState, useEffect } from 'react';

export const ComboBox = ({ value, options, onChange, placeholder = "Select option" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    useEffect(() => {
        // When value changes externally, update search term
        const matched = options.find(opt => opt.code === value);
        if (matched) {
            setSearchTerm(matched.name);
        } else {
            setSearchTerm('');
        }
    }, [value, options]);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        setSearchTerm(option.name);
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder={placeholder}
            />
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={option.code}
                            className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${
                                index === highlightedIndex ? "bg-green-100" : ""
                            }`}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => handleSelect(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
