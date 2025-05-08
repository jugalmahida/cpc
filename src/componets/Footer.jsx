import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useState, useEffect, useRef } from "react";
import DataService from "../api/dataService";
import ReactGA from 'react-ga4';

export default function Footer() {
    const [visitCount, setVisitCount] = useState(1);
    const [animatedCount, setAnimatedCount] = useState(1);
    const footerRef = useRef(null);
    const currentAnimationRef = useRef(null);
    const lastAnimatedValue = useRef(1);

    // Fetch initial count and set up polling
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const data = await DataService.getVisitCount();
                const newCount = data.totalVisits;

                if (newCount !== visitCount) {
                    setVisitCount(newCount);
                }
            } catch (error) {
                console.error("Error fetching visit count:", error);
            }
        };

        // Initial fetch
        fetchCount();

        // Set up polling every 10 seconds
        const pollInterval = setInterval(fetchCount, 10000);

        return () => clearInterval(pollInterval);
    }, []);

    // Animation effect when footer becomes visible
    useEffect(() => {
        if (!footerRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: footerRef.current,
            start: "top bottom",
            onEnter: () => animateCounter(),
            onEnterBack: () => animateCounter(), // handle when scrolling back up
        });

        // Also check if footer is already visible
        if (trigger && trigger.progress > 0) {
            animateCounter();
        }

        return () => {
            trigger?.kill();
            currentAnimationRef.current?.kill();
        };
    }, [visitCount]);

    const animateCounter = () => {
        if (currentAnimationRef.current) {
            currentAnimationRef.current.kill();
        }

        const animation = gsap.to({}, {
            value: visitCount,
            duration: 1,
            ease: "power2.out",
            onUpdate: function () {
                const newValue = Math.floor(gsap.getProperty(this.targets()[0], "value"));
                if (newValue !== lastAnimatedValue.current) {
                    setAnimatedCount(newValue);
                    lastAnimatedValue.current = newValue;
                }
            },
        });

        currentAnimationRef.current = animation;
    };

    // Social media handlers
    const handleInstagramClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click Instagram Link',
            label: 'Footer'
        });
        window.open('https://www.instagram.com/cpc_gujuni/', '_blank');
    };

    const handleLinkedInClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click LinkedIN Link',
            label: 'Footer'
        });
        window.open('https://linkedin.com/in/centre-for-professional-courses-gujarat-university-4a14a835a', '_blank');
    };

    const handleYoutubeClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click Youtube Link',
            label: 'Footer'
        });
        window.open('https://www.youtube.com/@CentreforProfessionalCoursesGU', '_blank');
    };

    return (
        <footer ref={footerRef} className="bg-[#1A556F] text-white py-6 mt-4">
            <div className="mx-auto w-full max-w-screen-xl flex flex-col items-center text-center">
                {/* Visitor Count */}
                <p className="text-lg font-semibold mb-2">
                    Visitor Count:{" "}
                    <span className="inline-block min-w-[30px] text-center">
                        {animatedCount.toLocaleString()}
                    </span>
                </p>

                

                {/* Copyright Text */}
                <p className="text-sm font-medium">
                    Copyright © 2025 Gujarat University Centre for Professional Courses.
                    All rights reserved.
                </p>

                {/* This is offical Website */}
                <p className="text-sm font-medium mt-1">
                    This is official website of Gujarat University Centre for Professional Courses.
                </p>

                {/* Social Media Section */}

                {/* This is offical Website */}
                <p className="text-xl font-bold mt-3">
                    Follow us on
                </p>
                <div className="flex space-x-4 mt-2">
                    {/* Instagram */}
                    <button
                        type="button"
                        className="text-white bg-[#1A556F] focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                        onClick={handleInstagramClick}
                    >
                        {/* <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                        </svg> */}
                        <img className="w-8 h-8" src="/instagram.png" />
                        <span className="sr-only">Instagram</span>
                    </button>

                    {/* LinkedIn */}
                    <button
                        type="button"
                        className="text-white bg-[#1A556F] focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                        onClick={handleLinkedInClick}
                    >
                        {/* <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                            <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                        </svg> */}
                        <img className="w-8 h-8" src="/linkedin.png" />
                        <span className="sr-only">LinkedIn</span>
                    </button>

                    {/* Youtube */}
                    <button
                        type="button"
                        className="text-white bg-[#1A556F] focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                        onClick={handleYoutubeClick}
                    >
                        {/* <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clipRule="evenodd" />
                        </svg> */}
                        <img className="w-8 h-8" src="/youtube.png" />
                        <span className="sr-only">Youtube</span>
                    </button>
                </div>
            </div>
        </footer>
    );
}