import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaRegAddressCard, FaSearch } from "react-icons/fa";
import { gsap } from "gsap";

// Add custom scrollbar styles
const scrollbarStyles = `
  /* For WebKit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #1F2937;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #4B5563;
    border-radius: 3px;
  }
  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #4B5563 #1F2937;
  }
`;

export default function AdmissionFloatingButtons() {
  const [isGlowing, setIsGlowing] = useState(true);
  // Initialize isOpen based on localStorage - will be false initially until checked in useEffect
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  // Refs for GSAP animations
  const overlayRef = useRef(null);
  const popupRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    // Create animation for closing
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(false)
    });

    tl.to(popupRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)"
    });

    tl.to(overlayRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
      duration: 0.3
    }, "-=0.2");
  };

  const viewPrograms = () => {
    // Create animation for closing before navigation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);

        // First check if we're already on the page that has the academics section
        if (location.pathname === '/' || location.pathname === '') {
          // If we're already on the main page, just scroll to the academics section
          const academicsSection = document.getElementById('academics');
          if (academicsSection) {
            academicsSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            // If the element doesn't exist yet, use the hash navigation (might reload)
            window.location.href = '#academics';
          }
        } else {
          // If we're on a different page, navigate to homepage with the hash
          navigate('/#academics');
        }
        // After navigating/scrolling, mark the popup as seen
        localStorage.setItem('hasSeenAdmissionPopup', 'true');
      }
    });

    tl.to(footerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.2
    });

    tl.to(contentRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.2
    }, "-=0.1");

    tl.to(headerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.2
    }, "-=0.1");

    tl.to(popupRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)"
    }, "-=0.1");

    tl.to(overlayRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
      duration: 0.3
    }, "-=0.2");
  };

  const entranceGuidelinesOnClick = () => {
    window.open("https://api.gucpc.in/uploads/announcementFile/announcementFile-438c245c02a15e3188b00d71b98d0659.pdf", "_blank");

  }
  const meritGuidelinesOnClick = () => {
    window.open("https://api.gucpc.in/uploads/announcementFile/announcementFile-d8ba04a51968d672bf8e46bcb80df4b8.pdf", "_blank");

  }


  // Effect to handle the automatic popup opening on first load
  // useEffect(() => {
  //   // Check if the flag exists in localStorage
  //   const hasSeen = localStorage.getItem('hasSeenAdmissionPopup');

  //   // If the flag is not set (or is not 'true'), open the popup and set the flag
  //   if (hasSeen !== 'true') {
  //     setIsOpen(true);
  //     // Set the flag so it doesn't open automatically next time
  //     localStorage.setItem('hasSeenAdmissionPopup', 'true');
  //   }

  //   // This effect should only run once on mount
  // }, []); // Empty dependency array ensures it runs only on mount

  // Effect for GSAP animations when popup opens
  useEffect(() => {
    if (isOpen && overlayRef.current && popupRef.current) {
      // Create an animation timeline
      const tl = gsap.timeline();

      // Start with overlay and popup initially invisible
      gsap.set(overlayRef.current, { backgroundColor: "rgba(0,0,0,0)" });
      gsap.set(popupRef.current, {
        scale: 0.5,
        opacity: 0,
        rotationX: 15
      });

      // Content sections
      if (headerRef.current) gsap.set(headerRef.current, { y: -30, opacity: 0 });
      if (contentRef.current) gsap.set(contentRef.current, { y: 30, opacity: 0 });
      if (footerRef.current) gsap.set(footerRef.current, { y: 30, opacity: 0 });

      // Animate overlay (background fade in)
      tl.to(overlayRef.current, {
        backgroundColor: "rgba(0,0,0,0.5)",
        duration: 0.4,
        ease: "power2.out"
      });

      // Animate popup (scale and fade in with slight bounce)
      tl.to(popupRef.current, {
        scale: 1,
        opacity: 1,
        rotationX: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Animate content sections sequentially
      if (headerRef.current) {
        tl.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.3");
      }

      if (contentRef.current) {
        tl.to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2");
      }

      if (footerRef.current) {
        tl.to(footerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2");
      }
    }
  }, [isOpen]);

  // Existing effect for the glowing animation
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 1000);

    return () => clearInterval(glowInterval);
  }, []);

  // Existing effect for adding scrollbar styles
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);

    // Cleanup
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      {/* <div className="fixed left-0 bottom-5 md:bottom-auto md:top-24 flex flex-col gap-2 md:gap-4 z-50 m-2 md:m-4 lg:m-6">
        <div className="relative">
          <div className={`absolute inset-0 rounded-xl md:rounded-2xl transition-all duration-700 ${isGlowing
            ? 'bg-slate-400 blur sm:blur-md opacity-70 scale-105 md:scale-110'
            : 'bg-transparent blur-none opacity-0 scale-100'
            }`}></div>
          <button
            onClick={openPopup} // This button still opens the popup on click
            className="relative text-white font-medium py-2 px-3 md:py-3 md:px-4 rounded-lg md:rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center bg-[#1e3f59] hover:bg-[#1A556F] text-xs sm:text-sm md:text-base whitespace-nowrap"
          >
            <span className="relative z-10 text-center leading-tight">Admission Open 2025</span>
          </button>
        </div>
      </div> */}

      {/* Popup Modal */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div
            ref={popupRef}
            className="relative bg-slate-800 text-white rounded-lg overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md shadow-xl perspective-1000"
            style={{ maxHeight: '90vh' }}
          >
            {/* Close button - kept outside the scrollable area */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 bg-slate-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 hover:bg-slate-600"
            >
              ✕
            </button>

            {/* Entire Content Area - Now Scrollable with visible scrollbar */}
            <div className="overflow-y-auto max-h-[90vh] scrollbar-visible scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
              {/* Header */}
              <div ref={headerRef} className="w-full flex justify-center">
                <img
                  src="/images/popupheader1.png"
                  alt="GUCPC 2025 Admission Open"
                  className="w-full object-contain"
                />
              </div>

              {/* Content */}
              <div ref={contentRef} className="p-3 sm:p-4">
                <ul className="space-y-2 text-md mb-3">
                  <li className="flex items-start font-bold">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Admission Process Exclusively Only Through the GCAS Portal</span>
                  </li>
                  <li className="flex items-start font-bold">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>All Fees will be paid only through ONLINE Mode</span>
                  </li>
                </ul>

                {/* Registration Link Section */}
                <div
                  className="bg-slate-700 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between
                text-sm md:text-base mb-3"
                > {/* Background and layout for the link */}
                  <span className="font-semibold text-gray-300 mb-1 sm:mb-0 mr-2">Registration Link:</span> {/* Text label */}
                  <a
                    href="https://gcas.gujgov.edu.in/"
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // Recommended for security when using target="_blank"
                    className="text-yellow-400 hover:underline break-all text-center sm:text-right" // Styled link
                  >
                    https://gcas.gujgov.edu.in/
                  </a>
                </div>

                {/* Two Columns Section */}
                <div className="flex flex-col sm:flex-row border-t border-gray-600 p-2 sm:p-4 gap-4 sm:gap-0">
                  {/* Left Column */}
                  <div className="w-full sm:w-1/2 sm:pr-2 sm:border-r border-gray-500 text-center">
                    <p className="font-bold text-sm">
                      Entrance Exam Based Admission
                    </p>
                    <div className="flex justify-center mt-2">
                      <button
                        className="bg-yellow-500 text-slate-800 font-bold text-xs sm:text-sm py-1 px-2 rounded-full hover:bg-yellow-400 transition-colors" onClick={entranceGuidelinesOnClick}
                      >
                        View Guidelines
                      </button>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-full sm:w-1/2 sm:pl-2 text-center">
                    <p className="font-bold text-sm">
                      12th Std or Equivalent Merit Based Admission
                    </p>
                    <div className="flex justify-center mt-2">
                      <button
                        className="bg-yellow-500 text-slate-800 font-bold text-xs sm:text-sm py-1 px-2 rounded-full hover:bg-yellow-400 transition-colors" onClick={meritGuidelinesOnClick}
                      >
                        View Guidelines
                      </button>
                    </div>
                  </div>
                </div>

                {/* Programme Highlights Section */}
                <div className="px-2 sm:px-4 py-2 bg-slate-700 rounded-lg mt-3">
                  <h3 className="text-center font-bold text-sm sm:text-base mb-2 text-yellow-400">
                    Explore Our Premier Programmes
                  </h3>
                  <h4 className="text-xs sm:text-sm font-semibold text-yellow-300 mb-1">Entrance Exam Based Programmes:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm mb-3">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Department of Animation (All Courses)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>School of Design (All Courses)</span>
                    </li>
                  </ul>

                  <h4 className="text-xs sm:text-sm font-semibold text-yellow-300 mb-1">Merit Based Programmes:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Department of IT-IMS (All Courses)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Department of Mobile Application and Technologies (All Courses)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Department of Management (All Courses)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Department of Aviation, Hospitality & Travel Management (All Courses)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer Section with Attractive Link */}
              <div ref={footerRef} className="p-4 border-t border-gray-600 bg-slate-800 flex flex-col gap-3"> {/* Container for footer elements */}

                {/* Explore Programmes Button */}
                <button
                  onClick={viewPrograms} // This button also sets the flag
                  className="w-full bg-yellow-500 text-slate-800 font-bold text-sm py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors shadow"
                >
                  Explore All Programmes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}