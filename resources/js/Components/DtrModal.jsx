import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";

export default function DtrModal({ office, type, label, onClose }) {
    const webcamRef = useRef(null);

    const [time, setTime] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [location, setLocation] = useState(null);

    const [distance, setDistance] = useState(null);
    const [isInsideRadius, setIsInsideRadius] = useState(true);
    const [matchedOffice, setMatchedOffice] = useState(null);

    const [image, setImage] = useState(null);
    const [isCaptured, setIsCaptured] = useState(false);

    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
    }, []);

    // Calculate distance using the Haversine formula
    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;

        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    // Get employee location
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.error(err);
                alert("Please allow location access.");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }, []);

    // Compute distance from office
    useEffect(() => {
        if (!location || !office?.length) return;

        let nearestDistance = Infinity;
        let inside = false;
        let matched = null;

        office.forEach((currentOffice) => {
            const meters = getDistanceInMeters(
                Number(location.lat),
                Number(location.lng),
                Number(currentOffice.lat),
                Number(currentOffice.lng),
            );

            if (meters < nearestDistance) {
                nearestDistance = meters;
            }

            if (meters <= Number(currentOffice.radius)) {
                inside = true;
                matched = currentOffice;
                nearestDistance = meters;
            }
        });

        setDistance(nearestDistance);
        setIsInsideRadius(inside);
        setMatchedOffice(matched);
    }, [location, office]);

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) {
            setImage(imageSrc);
            setIsCaptured(true);
        }
    }, []);

    const retakePhoto = () => {
        setImage(null);
        setIsCaptured(false);
    };

    const handleConfirm = async () => {
        if (submitting) return;

        try {
            setSubmitting(true);

            if (!image) {
                alert("Please capture a photo first.");
                return;
            }

            if (!location) {
                alert("Location not available.");
                return;
            }

            if (!isInsideRadius) {
                alert(
                    `You are ${Math.round(
                        distance,
                    )} meters away from the office.\n\nAllowed Radius: ${
                       matchedOffice?.radius
                    } meters.\n\nYou cannot punch outside the allowed radius.`,
                );

                return;
            }

            const response = await fetch(image);
            const blob = await response.blob();

            const file = new File([blob], "capture.jpg", {
                type: "image/jpeg",
            });

            const formData = new FormData();

            formData.append("type", type);
            formData.append("latitude", location.lat);
            formData.append("longitude", location.lng);
            formData.append("photo", file);

            await axios.post("/user/dtr/punch", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to record punch.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2">{label}</h2>

                <p className="text-gray-600 mb-4">Time: {time}</p>

                {!isCaptured ? (
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="rounded w-full mb-3"
                        videoConstraints={{
                            facingMode: "user",
                        }}
                    />
                ) : (
                    <img
                        src={image}
                        alt="Captured"
                        className="rounded w-full mb-3"
                    />
                )}

                {!isCaptured ? (
                    <button
                        onClick={capturePhoto}
                        className="w-full bg-gray-800 text-white py-2 rounded mb-3"
                    >
                        Capture Photo
                    </button>
                ) : (
                    <button
                        onClick={retakePhoto}
                        className="w-full bg-yellow-500 text-white py-2 rounded mb-3"
                    >
                        Retake Photo
                    </button>
                )}

                {location ? (
                    <>
                        <div className="text-sm text-gray-600">
                            📍 <strong>Your Location</strong>
                            <br />
                            {location.lat}, {location.lng}
                            <br />
                            <a
                                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                            >
                                View on Google Maps
                            </a>
                        </div>

                        {distance !== null && (
                            <div
                                className={`mt-4 rounded-lg border p-3 ${
                                    isInsideRadius
                                        ? "border-green-300 bg-green-50 text-green-700"
                                        : "border-red-300 bg-red-50 text-red-700"
                                }`}
                            >
                                <div>
                                    <strong>Office:</strong>{" "}
                                    {matchedOffice?.office ?? "Nearest Office"}
                                    <br />
                                    <strong>Allowed Radius:</strong>{" "}
                                    {matchedOffice?.radius ?? "-"} meters
                                </div>

                                <div>
                                    <strong>Your Distance:</strong>{" "}
                                    {Math.round(distance)} meters
                                </div>

                                <div className="mt-2 font-semibold">
                                    {isInsideRadius
                                        ? "✅ You are within the allowed radius."
                                        : "❌ You are outside the allowed radius."}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-red-500 text-sm">
                        Getting your location...
                    </p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={
                            !image || !location || submitting || !isInsideRadius
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
