import React, { forwardRef, useRef, Children, isValidElement } from "react";
import Select from "react-select";

// Optional: Tailwind-style custom styling
const customStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? "#6366f1" : "#d1d5db", // focus:border-indigo-500 / border-gray-300
        boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : base.boxShadow,
        borderRadius: "0.375rem", // rounded-md
        minHeight: "2.25rem",
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

export default forwardRef(function MultiSelectDropdown(
    { className = "", children, value = [], onChange, ...props },
    ref,
) {
    const inputRef = ref || useRef();

    // Convert <option> children to { value, label } objects
    const options = Children.toArray(children)
        .filter(isValidElement)
        .map((child) => ({
            value: child.props.value,
            label: child.props.children,
        }))
        .filter((opt) => opt.value !== ""); // Optional: remove placeholder

    const selectedOptions = options.filter((opt) =>
        Array.isArray(value)
            ? value.map(String).includes(String(opt.value))
            : false,
    );

    const handleChange = (selected) => {
        const values = selected
            ? selected.map((opt) => Number(opt.value)) // keep ids as numbers
            : [];

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
                {...props}
            />
        </div>
    );
});
