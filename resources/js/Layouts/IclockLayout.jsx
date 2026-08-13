export default function IclockLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </div>
        </div>
    );
}
