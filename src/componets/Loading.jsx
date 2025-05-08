import React from "react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative text-center">
                {/* Logo */}
                <img src="/cpclogo.png" alt="Logo" className="w-52 mx-auto mb-4" />

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-[#1A556F] animate-fade-in">
                    Centre for Professional Courses
                </h1>

                {/* Subtitle - Gujarat University */}
                <p className="text-lg md:text-xl text-gray-700 mt-2 animate-fade-in">
                    Gujarat University
                </p>

                {/* Animated Spinner */}
                <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>

                {/* Please wait... Text */}
                <p className="mt-4 text-lg text-gray-600 animate-pulse">Please wait...</p>
            </div>
        </div>
    );
}
