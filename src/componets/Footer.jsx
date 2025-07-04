import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useState, useEffect, useRef, useCallback } from "react";
import ReactGA from 'react-ga4';
import { useVisitCount } from "../hooks/useVisitCount";

export default function Footer() {
    const { visitCount, isLoading, error, isConnected } = useVisitCount();
    const [animatedCount, setAnimatedCount] = useState(0);
    const footerRef = useRef(null);
    const currentAnimationRef = useRef(null);
    const lastAnimatedValue = useRef(0);
    const hasAnimated = useRef(false);

    // Debounced animation function
    const animateCounter = useCallback(() => {
        if (currentAnimationRef.current) {
            currentAnimationRef.current.kill();
        }

        // Don't animate if count hasn't changed significantly
        if (Math.abs(visitCount - lastAnimatedValue.current) < 1) {
            return;
        }

        const startValue = hasAnimated.current ? animatedCount : 0;
        hasAnimated.current = true;

        // Create an object with a value property to animate
        const counter = { value: startValue };

        const animation = gsap.to(counter, {
            value: visitCount,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () {
                const newValue = Math.floor(counter.value);
                if (newValue !== lastAnimatedValue.current) {
                    setAnimatedCount(newValue);
                    lastAnimatedValue.current = newValue;
                }
            },
            onComplete: () => {
                setAnimatedCount(visitCount);
                lastAnimatedValue.current = visitCount;
            }
        });

        currentAnimationRef.current = animation;
    }, [visitCount, animatedCount]);

    // Animation effect when footer becomes visible
    useEffect(() => {
        if (!footerRef.current || visitCount === 0) return;

        const trigger = ScrollTrigger.create({
            trigger: footerRef.current,
            start: "top 90%",
            end: "bottom 10%",
            onEnter: animateCounter,
            onEnterBack: animateCounter,
        });

        // Check if footer is already visible
        if (trigger && trigger.progress > 0) {
            animateCounter();
        }

        return () => {
            trigger?.kill();
        };
    }, [animateCounter]);

    // Cleanup animation on unmount
    useEffect(() => {
        return () => {
            currentAnimationRef.current?.kill();
        };
    }, []);

    // Social media handlers with error handling
    const handleSocialClick = (platform, url) => {
        try {
            ReactGA.event({
                category: 'Social',
                action: `Click ${platform} Link`,
                label: 'Footer'
            });
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error(`Error opening ${platform} link:`, error);
        }
    };

    const socialLinks = [
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/cpc_gujuni/',
            icon: '/instagram.png',
            onClick: () => handleSocialClick('Instagram', 'https://www.instagram.com/cpc_gujuni/')
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/centre-for-professional-courses-gujarat-university-4a14a835a',
            icon: '/linkedin.png',
            onClick: () => handleSocialClick('LinkedIn', 'https://linkedin.com/in/centre-for-professional-courses-gujarat-university-4a14a835a')
        },
        {
            name: 'YouTube',
            url: 'https://www.youtube.com/@CentreforProfessionalCoursesGU',
            icon: '/youtube.png',
            onClick: () => handleSocialClick('YouTube', 'https://www.youtube.com/@CentreforProfessionalCoursesGU')
        }
    ];

    const renderVisitorCount = () => {
        if (isLoading) {
            return (
                <span className="inline-block min-w-[60px] text-center">
                    <div className="animate-pulse bg-white/20 h-6 w-16 rounded"></div>
                </span>
            );
        }

        if (error) {
            return (
                <span className="inline-block min-w-[60px] text-center text-red-200">
                    Error
                </span>
            );
        }

        return (
            <span className="inline-block min-w-[60px] text-center">
                {animatedCount.toLocaleString()}
            </span>
        );
    };

    return (
        <footer ref={footerRef} className="bg-[#1A556F] text-white py-6 mt-4">
            <div className="mx-auto w-full max-w-screen-xl flex flex-col items-center text-center px-4">
                {/* Visitor Count */}
                <div className="flex items-center gap-2 mb-2">
                    <p className="text-lg font-semibold">
                        Visitor Count: {renderVisitorCount()}
                    </p>
                    {/* Connection status indicator */}
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
                            }`}
                        title={isConnected ? 'Connected' : 'Disconnected'}
                    />
                </div>

                {/* Copyright Text */}
                <p className="text-sm font-medium mb-1">
                    Copyright © 2025 Gujarat University Centre for Professional Courses.
                    All rights reserved.
                </p>

                {/* Official Website Text */}
                <p className="text-sm font-medium mb-3">
                    This is official website of Gujarat University Centre for Professional Courses.
                </p>

                {/* Social Media Section */}
                <p className="text-xl font-bold mb-2">
                    Follow us on
                </p>

                <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                        <button
                            key={social.name}
                            type="button"
                            className="text-white bg-[#1A556F] hover:bg-[#0f3a4a] focus:ring-4 focus:outline-none focus:ring-white/20 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center transition-colors duration-200"
                            onClick={social.onClick}
                            aria-label={`Follow us on ${social.name}`}
                        >
                            <img
                                className="w-8 h-8"
                                src={social.icon}
                                alt={`${social.name} icon`}
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    );
}