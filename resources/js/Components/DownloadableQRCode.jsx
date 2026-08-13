// resources/js/Components/DownloadableQRCode.jsx
import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";

export default function DownloadableQRCode({ value, filename, size = 150, hidden = true }) {
    const qrRef = useRef(null);

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return;

        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        saveAs(pngUrl, filename || "qrcode.png");
    };

    return (
        <div className="flex flex-col items-start">
            {/* QR Code (hidden or visible depending on prop) */}
            <div ref={qrRef} className={hidden ? "hidden" : ""}>
                <QRCodeCanvas
                    value={value}
                    size={size}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                />
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="text-blue-600 hover:text-blue-800 underline"
            >
                Download
            </button>
        </div>
    );
}
