import React, { useState, useEffect, useRef } from "react";
import clockTowerIcon from "/images/crossarrow.png"; // Import the image
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import dataService from "../api/dataService"; // Import your dataService
import logo from "/cpclogo.png"; 

export default function Layout() {
  
  const navigate = useNavigate();
  const location = useLocation();

  const isInitialMount = useRef(true); // Add a ref

  useEffect(() => {
    if (isInitialMount.current && location.pathname === "/") {
      const incrementVisitCount = async () => {
        try {
          await dataService.incrementVisits();
        } catch (error) {
          console.error("Failed to increment visit count:", error);
        }
      };

      // Check if the hostname is localhost or 127.0.0.1
      if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        incrementVisitCount(); // Call the function only if not localhost
      }

      isInitialMount.current = false;
    }
  }, [location.pathname]);
  

  // Redirect to /home when the video is clicked
  const handleVideoClick = () => {
    navigate("/");
  };

  // Conditionally render the background video based on the route
  const showBackgroundVideo = location.pathname === "/";

  return (
    <div
      className="relative bg-white m-0 p-0 overflow-x-hidden"
    >
      {/* Conditionally render the background video */}
      {showBackgroundVideo && (
        <div
          className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
          onClick={handleVideoClick}
        >
          <video
            playsInline
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            <source src={"https://gucpc.in/public/video/CpcLandingPage.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: "#00000055" }}
          ></div>

          <div className="absolute top-0 right-0 p-2 sm:p-3 md:p-4 text-white z-10">
            <div className="flex items-center relative">
              <img
                src={logo}
                alt="Logo"
                className="w-auto h-16 sm:h-20 md:h-24 lg:h-32"
              />
              {/* Pink vertical line */}
              <div
                className="h-16 sm:h-20 md:h-24 lg:h-32 w-0.5 bg-pink-500"
              ></div>
              <div className="pl-2 sm:pl-3 md:pl-4 text-left">
                <h2 className="text-sm md:text-lg lg:text-xl font-bold leading-tight">
                  Gujarat University
                </h2>
                <h1 className="text-md sm:text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Centre for<br /> Professional<br /> 
                   Courses
                </h1>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-xl font-semibold z-10 animate-pulse">
            <span style={{ cursor:"pointer", border: '2px solid white', padding: '10px 20px', borderRadius: '5px' }}>
              Continue
            </span>
          </div>
        </div>
      )}

      {/* Render nested routes */}
      <Outlet />
    </div>
  );
}