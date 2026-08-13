import { useEffect, useState } from "react";

export default function ModalDrawer({
    show,
    onClose,
    children,
    closeable = true,
    maxWidth = "4xl",
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true); // mount first
            // trigger enter animation slightly after mount
            setTimeout(() => setAnimateIn(true), 10);
        } else {
            // start exit animation
            setAnimateIn(false);
            const timer = setTimeout(() => setIsVisible(false), 300); // unmount after animation
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
                    animateIn ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeable ? onClose : undefined}
            />

            {/* Drawer */}
            <div
                className={`relative bg-white h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out
                    w-full sm:max-w-${maxWidth}
                    ${animateIn ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
