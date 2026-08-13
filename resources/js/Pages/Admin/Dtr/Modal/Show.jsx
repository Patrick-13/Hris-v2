import React from "react";

const Show = ({ dtr }) => {
    console.log(dtr);
    const getCoord = (type) => {
        return dtr?.coordinates?.find((c) => c.type === type);
    };

    const punches = ["timeIn", "breakOut", "breakIn", "timeOut"];

    const renderMap = (lat, lng) => {
        if (!lat || !lng) return null;

        const src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

        return (
            <iframe src={src} className="w-full h-40 rounded" loading="lazy" />
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">
                DTR Details -{" "}
                {new Date(dtr?.punch_date).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}
            </h1>

            <div className="grid grid-cols-2 gap-4">
                {punches.map((type) => {
                    const coord = getCoord(type);

                    return (
                        <div
                            key={type}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <h2 className="font-semibold capitalize mb-2">
                                {type}
                            </h2>

                            {coord ? (
                                <>
                                    <img
                                        src={`/dtr-photo/${encodeURIComponent(coord.photo_path).replace(/%2F/g, "/")}`}
                                        alt={type}
                                        className="w-full h-40 object-cover rounded mb-2"
                                    />

                                    {/* MAP VIEW */}
                                    {/* {renderMap(coord.latitude, coord.longitude)} */}

                                    <p className="text-sm text-gray-700 mt-2">
                                        📍 {coord.latitude}, {coord.longitude}
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps?q=${coord.latitude},${coord.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-sm underline"
                                    >
                                        View on Google Maps
                                    </a>
                                </>
                            ) : (
                                <p className="text-gray-400 text-sm">
                                    No record
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Show;
