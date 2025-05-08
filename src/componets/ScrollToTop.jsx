import React, { useState, useEffect, useCallback } from "react";

export default function ScrollToTop() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleScroll = useCallback(() => {
        if (window.scrollY > 300) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        showScrollButton && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-24 right-7 p-3 bg-[#1A556F] text-white rounded-full shadow-lg transition-all z-[1500]"
            >
                <svg className="w-6 h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4" />
                </svg>
            </button>
        )
    );
}
