import React, { forwardRef, useRef, Children, isValidElement } from "react";
import Select from "react-select";

const customStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
        boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : base.boxShadow,
        borderRadius: "0.375rem",
        minHeight: "2.25rem",
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

export default forwardRef(function MultiSelectedDropdownEmployee(
    { className = "", children, value = [], onChange, ...props },
    ref,
) {
    const inputRef = ref || useRef();

    // Convert <option> children to react-select options
    const options = Children.toArray(children)
        .filter(isValidElement)
        .map((child) => ({
            value: Number(child.props.value), // Always number
            label: child.props.children,
        }))
        .filter((opt) => !isNaN(opt.value));

    // Ensure value is always an array of numbers
    const selectedValues = Array.isArray(value) ? value.map(Number) : [];

    const selectedOptions = options.filter((opt) =>
        selectedValues.includes(opt.value),
    );

    const handleChange = (selected) => {
        const values = selected ? selected.map((opt) => opt.value) : [];

        onChange(values);
    };

    return (
        <div className={className}>
            <Select
                ref={inputRef}
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                isMulti
                styles={customStyles}
                classNamePrefix="select"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                {...props}
            />
        </div>
    );
});
