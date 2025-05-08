import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from 'react-ga4';

export default function NotFoundPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate("/"), 5000); // Redirect to home after 5s
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-6 text-center">
            <h1 className="text-7xl font-bold text-gray-800">404</h1>
            <h2 className="text-2xl mt-2 font-medium">Page Not Found</h2>
            <p className="text-lg mt-4 text-gray-600 max-w-lg">
                Sorry, the page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <p className="text-gray-500 mt-2 text-sm">Redirecting to home in 5 seconds...</p>
            <a href="/" className="mt-6 px-6 py-3 bg-[#1A556F] text-white rounded-lg shadow-md hover:bg-[#2C3E50] transition" onClick={() => {
                ReactGA.event({
                    category: '404 Page',
                    action: 'Return Home Click',
                    label: '404 Return Home Button',
                });
            }}>
                Return Home Now
            </a>
        </div>
    );
}
