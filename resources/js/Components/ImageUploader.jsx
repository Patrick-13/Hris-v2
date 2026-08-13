import { useState, useEffect } from "react";

export default function ImageUploader({
    label,
    name,
    value = [],
    onChange,
    error,
}) {
    const [previews, setPreviews] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (Array.isArray(value)) {
            const newPreviews = value
                .map((item) => {
                    // Handle existing (string URL from database)
                    if (typeof item === "string") {
                        return `/storage/${item}`;
                    }

                    // Handle new uploaded file
                    if (item instanceof File) {
                        return URL.createObjectURL(item);
                    }

                    return null;
                })
                .filter(Boolean);

            setPreviews(newPreviews);
        }
    }, [value]);

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onChange(files);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="file"
                name={name}
                multiple
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Preview Section */}
            <div className="flex flex-wrap gap-3 mt-3">
                {previews.slice(0, 3).map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-24 h-24 object-cover rounded border"
                    />
                ))}
            </div>
            {previews.length > 3 && (
                <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="flex items-center mt-2 px-3 justify-center bg-blue-200 rounded-lg text-blue-600 text-sm font-medium hover:bg-gray-300"
                >
                    +{previews.length - 3} more
                </button>
            )}
            {/* Lightbox modal */}
            {showAll && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Uploaded Images
                            </h2>
                            <button
                                onClick={() => setShowAll(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {previews.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Preview ${index}`}
                                    className="w-full h-40 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
