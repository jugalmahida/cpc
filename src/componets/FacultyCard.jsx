import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Faculty.css';
import '../assets/css/Spinner.css';
import ReactGA from 'react-ga4'; // Import ReactGA

export default function FacultyCard({ facultyMember }) {
    const navigate = useNavigate();
    const [imageLoading, setImageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false); // Add state for loaded

    const handleClick = () => {
        ReactGA.event({
            category: 'Faculty',
            action: 'Click Faculty Card',
            label: `Faculty: ${facultyMember.name}`
        });
        navigate(`/faculty/${facultyMember._id}`, { state: { facultyMember } });

    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setIsLoaded(true); // Set loaded to true when image is loaded
    };

    const handleImageError = () => {
        setImageLoading(false);
        setIsLoaded(true); // Still set loaded to true to remove spinner
    };

    return (
        <div
            className="course-card flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 cursor-pointer"
            onClick={handleClick}
        >
            {/* Faculty Photo */}
            <div className="relative w-full h-48 md:h-40 md:w-32">
                {imageLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
                    </div>
                )}
                <img
                    className={`object-cover w-full h-full rounded-t-lg md:rounded-none md:rounded-s-lg transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={facultyMember.profileImageUrl}
                    alt={facultyMember.name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
            </div>
            {/* Faculty Details */}
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                    {facultyMember.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700">
                    {facultyMember.position}
                </p>
                <p className="mb-3 font-normal text-[#1A556F] hover:underline">
                    View more
                </p>
            </div>
        </div>
    );
}