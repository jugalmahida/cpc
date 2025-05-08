const UnderMaintenance = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 text-gray-900 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">Centre for Professional Courses</h2>
            <h1 className="text-4xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">🚧 Website Under Maintenance 🚧</h1>
            <p className="text-lg md:text-xl font-medium mb-8">We are currently making improvements. Please check back later.</p>

            {/* Contact Email */}
            <div className="mt-6 text-base md:text-lg font-medium">
                <p>For urgent inquiries, contact us at:</p>
                <a href="mailto:info.cpc@gujaratuniversity.ac.in" className="text-blue-600 hover:underline break-all">info.cpc@gujaratuniversity.ac.in</a>
            </div>

            {/* Social Media Links */}
            <div className="mt-12 bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Follow us on</h3>
                <div className="flex justify-center space-x-4">
                    <a href='https://www.instagram.com/cpc_gujuni/' target="_blank" rel="noopener noreferrer">
                        <button type="button" className="text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-3 text-center inline-flex items-center transition-all duration-300">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Instagram</span>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UnderMaintenance;
