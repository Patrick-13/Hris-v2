import "../css/app.css";
import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./Contexts/ThemeContext"; // ✅ new
import Apphead from "./Components/Apphead";
import { NotificationProvider } from "./Contexts/NotificationContext";

/* Register Service Worker */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration);
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    });
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                {/* <TkoProvider> */}
                <div className="min-h-screen flex flex-col">
                    <Apphead />

                    {/* Maintenance Announcement */}
                    {/* Announcement */}
                    {props.initialPage.props.announcement && (
                        <div className="bg-yellow-500 text-black overflow-hidden whitespace-nowrap border-b border-yellow-600">
                            <div className="animate-marquee inline-block py-2 px-4 font-semibold text-sm">
                                📢 {props.initialPage.props.announcement.title}:{" "}
                                {props.initialPage.props.announcement.body}
                            </div>
                        </div>
                    )}
                    <main className="flex-1">
                        <NotificationProvider
                            user={props.initialPage.props.auth.user}
                        >
                            <App {...props} />
                        </NotificationProvider>
                    </main>
                    <ToastContainer position="top-right" autoClose={3000} />
                    <footer className="bg-gradient-to-r from-blue-800 to-green-700 text-gray-100 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <p className="text-xs sm:text-sm md:text-base text-center font-medium break-words">
                                Version{" "}
                                <span className="text-blue-400">2.0.1</span> ©
                                2025 - Demo
                            </p>
                        </div>
                    </footer>
                </div>
                {/* </TkoProvider> */}
            </ThemeProvider>
        );
    },
    progress: {
        color: "#22c55e",
    },
});
