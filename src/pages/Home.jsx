import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaFilm, FaLaptopCode, FaMobileAlt, FaPalette, FaPlane, FaBusinessTime } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// React GA 4 
import ReactGA from 'react-ga4'; // Import ReactGA

// Componets
import Header from "../componets/Header";
import Footer from '../componets/Footer';
import ScrollToTop from "../componets/ScrollToTop";
import GetInTouch from "../componets/GetInTouch";

// General Images
import neerjamaam from "/images/neerjamaam.jpg";
import AboutCpcImage from "/images/aboutcpc.jpg";
import AboutGuImage from "/images/gu.jpg";
import registrar from "/images/registrar1.jpg";

// Student Grid
import im1 from "/images/studentgrid/im1.jpeg";
import im2 from "/images/studentgrid/DSC06620.JPG?url";
import im3 from "/images/studentgrid/im3.JPG?url";
import im4 from "/images/studentgrid/im4.jpg";
import im5 from "/images/studentgrid/im5.jpg";
import im6 from "/images/studentgrid/im6.jpg";
import im7 from "/images/studentgrid/im7.jpg";
import im8 from "/images/studentgrid/pr.jpg";
import im9 from "/images/studentgrid/im9.JPG?url";
import im10 from "/images/studentgrid/im10.jpg";
import im11 from "/images/studentgrid/DSC06510.JPG?url";
import im12 from "/images/studentgrid/im12.JPG?url";

// Home Animation (Gsap animation)
import HomeAnimation from "../assets/animations/HomeAnimation"; // Import HomeAnimation

// Logo
import logo from "/cpclogo.png";

import dataService from "../api/dataService"; // Import your dataService
import AdmissionFloatingButtons from "../componets/AdminssionFloatingButtons";
import AdmissionRegistrationFloatingButton from "../componets/AdmissionRegistrationFloatingButton";

export default function Home() {

  const location = useLocation();
  const aboutSectionRef = useRef(null);
  // const backgroundVideoRef = useRef(null); // Ref for the background video section
  const navigate = useNavigate();

  // Refer for animation
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const aboutGUContentRef = useRef(null); // Ref for the About GU content
  const neerjaMamRef = useRef(null);
  const registrarRef = useRef(null);
  const aboutGUImageRef = useRef(null);
  const aboutCPCImageRef = useRef(null);
  const programCardsRef = useRef([]); // Ref for program cards
  const placementImagesRef = useRef([]);
  const activityImagesRef = useRef([]);
  const guButtonRef = useRef(null);
  const cpcButtonRef = useRef(null); // Ref for CPC button
  const placementButtonRef = useRef(null); // Ref for Placement button
  const activityButtonRef = useRef(null); // ref for activity button
  const cpcContentRef = useRef(null); // Ref for the CPC content
  const gpRef = useRef(null);
  const viewUniMapButton = useRef(null);
  const viewFloorMapButton = useRef(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // Add loading state

  // Add video load handler
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  useEffect(() => {

    if (location.pathname === "/") {
      const incrementVisitCount = async () => {
        try {
          await dataService.incrementVisits();
          sessionStorage.setItem('visitCounted', 'true');

        } catch (error) {
          console.error("Failed to increment visit count:", error);
        }
      };

      // Check if the hostname is localhost or 127.0.0.1
      if (window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1" &&
        !sessionStorage.getItem('visitCounted')) {
        incrementVisitCount(); // Call the function only if not localhost
      }

    }
  }, [location.pathname]);


  const images = [
    "/images/Company_Logos/accrete.png",
    "/images/Company_Logos/crestdata.png",
    "/images/Company_Logos/techdefenders.png",
    "/images/Company_Logos/AdaniAirports.jpg",
    "/images/Company_Logos/TGB.png",
    "/images/Company_Logos/AirportsAuthorityIndia.png",
    "/images/Company_Logos/AddWeb.png",
    "/images/Company_Logos/cybercom.png",
    "/images/Company_Logos/iCreative.png",
    "/images/Company_Logos/invesics.png",
    "/images/Company_Logos/JCasp.png",
    "/images/Company_Logos/gujaratT.png"
  ];

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => { // Small delay for page render
        const section = document.querySelector(hash);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  const handleBackgroundClick = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreCpcClick = () => {
    ReactGA.event({
      category: 'Navigation',
      action: 'Click Explore CPC',
      label: 'Home Page'
    });
    navigate("/about");
  };

  const handleViewAllActivities = () => {
    ReactGA.event({
      category: 'Navigation',
      action: 'Click View All Activities',
      label: 'Home Page'
    });
    navigate("/activities");
  };

  const handleVerticalClick = (department) => {
    ReactGA.event({
      category: 'Navigation',
      action: `Click ${department}`,
      label: 'Home Page'
    });
    navigate("/academics", { state: { department } });
  };

  // New function to track external link clicks
  const handleExternalLinkClick = (url, label) => {
    ReactGA.event({
      category: 'External Link',
      action: `Click ${label}`,
      label: 'Home Page'
    });
    window.open(url, '_blank');
  };

  return (
    <div className="relative bg-white m-0 p-0 overflow-x-hidden">

      <AdmissionFloatingButtons />
      <AdmissionRegistrationFloatingButton />

      <Header transparent={true} />

      {/* Background Video Section */}
      <div
        ref={videoRef} // Attach the ref here
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden background-video-section"
        onClick={handleBackgroundClick}
      >
        {/* Video Loader */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A556F]"></div>
          </div>
        )}

        <video
          playsInline
          autoPlay
          muted
          loop
          className={`absolute inset-0 w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            minWidth: "100%",
            minHeight: "100%",
          }}
          onCanPlayThrough={handleVideoLoaded} // Add event listener
          onLoadedData={handleVideoLoaded} // Fallback event listener
        >
          <source src={"https://gucpc.in/public/video/CpcHomePage.mp4"} type="video/mp4" />
        </video>

        <div className="absolute inset-0 w-full h-full"></div>

        {/* Updated Text Positioning with Vertical Pink Line  */}
        <div className="absolute top-0 right-0 p-2 sm:p-3 md:p-4 text-white z-10" ref={titleRef}>
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
      </div>

      {/* About Gujarat University Section */}
      <div id="about-gu" className="p-4 sm:p-6 lg:p-12 bg-white">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left Section - About Content */}
          <div className="w-full lg:w-5/12 z-10" ref={aboutGUContentRef}>
            <h3 className="text-xl sm:text-3xl font-bold mb-6">
              About Gujarat University
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
              Established in 1949, Gujarat University is the largest in the state, serving over two lakh students through 235 colleges and numerous postgraduate departments. It plays a dual role as an affiliating body for undergraduate studies and a teaching university at the postgraduate level. Known for pioneering external examinations, it ensures access to education for working students and those with limited means. With a legacy spanning over 67 years, the University remains a premier institution fostering excellence across diverse disciplines.
            </p>
          </div>

          {/* Right Section - Image Card */}
          <div className="w-75 lg:w-96 mt-1 lg:mt-0" ref={aboutGUImageRef}>
            <img
              src={AboutGuImage}
              alt="Gujarat University"
              className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        </div>

        {/* Vice Chancellor and Registrar Sections */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Neerja ma'am Section */}
          <a
            onClick={() => {
              ReactGA.event({
                category: 'Faculty Links',
                action: 'Click Neerja Mam',
                label: 'Vice Chancellor Link',
              });
            }}
            ref={neerjaMamRef} href="https://www.gujaratuniversity.ac.in/vicechancellor" target="_blank" rel="noopener noreferrer">
            <div className="p-3 border border-gray-300 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <img
                  className="h-40 w-40 object-cover mb-4 rounded-lg"
                  src={neerjamaam}
                  alt="Dr. Neerja A Gupta"
                />
                <h2 className="text-xl font-bold text-[#1A556F]">Dr. Neerja A Gupta</h2>
                <p className="text-sm font-semibold text-gray-600">Vice Chancellor</p>
                <p className="text-sm text-gray-500 mb-2">Gujarat University</p>
                <p className="text-sm text-gray-500">View More</p>
              </div>
            </div>
          </a>

          {/* Registrar Sir Section */}
          <a
            onClick={() => {
              ReactGA.event({
                category: 'Faculty Links',
                action: 'Click Registrar Sir',
                label: 'Registrar Link',
              });
            }}

            ref={registrarRef} href="https://www.gujaratuniversity.ac.in/registrar" target="_blank" rel="noopener noreferrer">
            <div className="p-3 border border-gray-300 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <img
                  className="h-40 w-40 object-cover mb-4 rounded-lg"
                  src={registrar}
                  alt="Dr. Piyush M Patel"
                />
                <h2 className="text-xl font-bold text-[#1A556F]">Dr. Piyush M Patel</h2>
                <p className="text-sm font-semibold text-gray-600">Registrar</p>
                <p className="text-sm text-gray-500 mb-2">Gujarat University</p>
                <p className="text-sm text-gray-500">View More</p>

              </div>
            </div>
          </a>
        </div>

        {/* Explore Gujarat University Button */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mt-12">
          <button
            className="px-8 py-3 text-white font-semibold rounded-lg bg-[#1A556F] hover:bg-[#2C3E50] transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => handleExternalLinkClick("https://www.gujaratuniversity.ac.in/", "Explore Gujarat University")}
            ref={guButtonRef}
          >
            Explore Gujarat University
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-2 sm:my-3 lg:my-4 border-gray-300" />

      {/* About CPC Section */}
      <div id="about-cpc" className="bg-white text-black p-6">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 lg:gap-12 p-1 sm:p-4 lg:p-12">
          {/* Content Container (Handles Mobile Stacking) */}
          <div className="w-full lg:w-3/5 order-1 lg:order-2" ref={cpcContentRef}>
            <h2 className="text-xl text-left font-bold sm:text-2xl lg:text-3xl font mb-4 lg:mb-6">
              About Centre for Professional Courses
            </h2>

            {/* Image Container (Moves on Mobile) */}
            <div className="lg:hidden mb-4 flex justify-center items-start">
              <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={AboutCpcImage}
                  alt="Center for Professional Courses"
                  className="w-full rounded-lg object-cover h-48 sm:h-56 lg:h-64"
                />
              </div>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
              The Centre for Professional Courses (CPC), established in 2023, has rapidly positioned itself as a beacon of excellence, offering innovative and dynamic academic programmes tailored to address the global challenges of today’s educational landscape. Situated in the scenic precincts of Gujarat University, the Centre blends cutting-edge academic curriculum with a campus that fosters creativity and intellectual growth.
            </p>
            <div className="mt-4 flex justify-start">
              <button
                className="px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300"
                style={{ backgroundColor: "#1A556F" }}
                onClick={handleExploreCpcClick}
                ref={cpcButtonRef}
              >
                Know More About CPC
              </button>
            </div>
          </div>

          {/* Desktop Image (Hidden on Mobile) */}
          <div className="w-full lg:w-2/5 justify-center items-start order-2 lg:order-1 hidden lg:flex" ref={aboutCPCImageRef}>
            <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={AboutCpcImage}
                alt="Center for Professional Courses"
                className="w-full rounded-lg object-cover h-48 sm:h-56 lg:h-64"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Divider */}
      <hr className="my-1 sm:my-2 lg:my-3 border-gray-300" />

      {/* Programs Section */}
      <div id="academics" className="p-4 sm:p-6 lg:p-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6">
          Programmes
        </h2>
        <style jsx>{`
    .course-card {
      background: #ffffff;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .course-card:hover {
      box-shadow: 0px 8px 20px rgba(29, 86, 111, 0.2);
      transform: translateY(-5px);
      border-color: #1A556F;
    }
    .admission-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    .entrance-badge {
      background-color: #800000;
      color: #FFFFFF;
    } 
    .merit-badge {
      background-color: #008080 ;
      color: #FFFFFF;
    }
  `}</style>
        {/* Grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* Department of Animation - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("Department of Animation")}
            ref={(el) => (programCardsRef.current[0] = el)}
          >
            <div className="admission-badge entrance-badge">Entrance Exam Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaFilm className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">Department of Animation</h3>
            <p className="text-sm text-gray-600 mt-2">
              Expand your creative horizons and master the art of animation to craft unforgettable visual journeys that engage and inspire.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>

          {/* School of Design - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("School of Design")}
            ref={(el) => (programCardsRef.current[1] = el)}
          >
            <div className="admission-badge entrance-badge">Entrance Exam Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaLaptopCode className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">School of Design</h3>
            <p className="text-sm text-gray-600 mt-2">
              Delve into creativity and immerse yourself in the world of design where you'll transform ideas into impactful visual experiences.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>

          {/* Department of Mobile Applications & Technologies - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("Department of Mobile Application and Technologies")}
            ref={(el) => (programCardsRef.current[2] = el)}
          >
            <div className="admission-badge merit-badge">Merit Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaMobileAlt className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">Department of Mobile Applications & Technologies</h3>
            <p className="text-sm text-gray-600 mt-2">
              Push the boundaries of innovation and dive into the world of mobile applications and technologies to create cutting-edge solutions that shape tomorrow's digital experience.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>

          {/* Department of ITIMS - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("Department of IT IMS")}
            ref={(el) => (programCardsRef.current[3] = el)}
          >
            <div className="admission-badge merit-badge">Merit Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaPalette className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">Department of ITIMS</h3>
            <p className="text-sm text-gray-600 mt-2">
              Broaden your technical skills and explore the world of IT and Information Management Systems where you'll shape innovative solutions that drive the future.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>

          {/* Department of Management - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("Department of Management")}
            ref={(el) => (programCardsRef.current[4] = el)}
          >
            <div className="admission-badge merit-badge">Merit Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaBusinessTime className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">Department of Management</h3>
            <p className="text-sm text-gray-600 mt-2">
              Empowering the next generation of global leaders through comprehensive programs in management, international trade, and finance.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>

          {/* Department of Aviation, Hospitality & Travel Management - Span 4 columns */}
          <div
            className="course-card p-6 flex flex-col items-center text-center hover:border-[#1A556F] sm:col-span-4 cursor-pointer"
            onClick={() => handleVerticalClick("Department of Aviation, Hospitality & Travel Management")}
            ref={(el) => (programCardsRef.current[5] = el)}
          >
            <div className="admission-badge merit-badge">Merit Based</div>
            <div className="p-4 bg-[#1A556F] rounded-full mb-4">
              <FaPlane className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold">Department of Aviation, Hospitality & Travel Management</h3>
            <p className="text-sm text-gray-600 mt-2">
              Embark a journey through the dynamic fields of aviation, hospitality and travel management where you'll pioneer new possibilities and enhance future of global travel.
            </p>
            <a className="mt-4 text-[#1A556F] font-medium hover:underline">View more</a>
          </div>
        </div>
      </div>


      {/* Divider */}
      <hr className="my-2 sm:my-3 lg:my-4 border-gray-300" />


      <div id="placements" className="text-black p-6"> {/* Updated */}
        <section className="p-4 sm:p-6 lg:p-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8">
            Internship & Placement
          </h2>
          {/* Company Logos Grid */}
          <div className=" sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">


            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (

                <img
                  className="w-full h-20 m-3 object-contain"
                  src={image}
                  onClick={() => openModal(image)}
                  ref={(el) => (placementImagesRef.current[index] = el)} // Ref added here
                />

              ))}
            </div>

          </div>

          {/* More About Placement Button */}
          <div className="text-center mt-14">
            <button
              className="px-6 py-3 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: "#1A556F" }}
              onClick={() => {
                ReactGA.event({
                  category: 'Navigation',
                  action: 'Click More About Placement',
                  label: 'Home Page'
                });
                navigate("/placements");
              }}
              ref={placementButtonRef} // Ref added here
            >
              More about placement
            </button>
          </div>
        </section>
      </div>

      <hr className="my-2 sm:my-3 lg:my-4 border-gray-300" />

      {/* Student Activities Section */}
      <div id="activities" className="p-4 sm:p-6 lg:p-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8">
          Student Activities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-2">
          <div className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <div>
                <img className="h-auto max-w-full rounded-lg" src={im1} alt="" ref={(el) => (activityImagesRef.current[0] = el)} />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im2} alt="" ref={(el) => (activityImagesRef.current[1] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im3} alt="" ref={(el) => (activityImagesRef.current[2] = el)} />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im4} alt="" ref={(el) => (activityImagesRef.current[3] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im5} alt="" ref={(el) => (activityImagesRef.current[4] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im6} alt="" ref={(el) => (activityImagesRef.current[5] = el)} />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im7} alt="" ref={(el) => (activityImagesRef.current[6] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im8} alt="" ref={(el) => (activityImagesRef.current[7] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im9} alt="" ref={(el) => (activityImagesRef.current[8] = el)} />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im10} alt="" ref={(el) => (activityImagesRef.current[9] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im11} alt="" ref={(el) => (activityImagesRef.current[10] = el)} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
              </div>
              <img className="h-auto max-w-full rounded-lg" src={im12} alt="" ref={(el) => (activityImagesRef.current[11] = el)} />
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button
            className="px-6 py-3 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: "#1A556F" }}
            onClick={handleViewAllActivities} // Add onClick handler
            ref={activityButtonRef} // Ref added here
          >
            View All Activities
          </button>
        </div>
      </div>


      {/* Divider */}
      <hr className="my-2 sm:my-3 lg:my-4 border-gray-300" />

      {/* Contact Details */}
      <GetInTouch />

      {/* Added space-x-2 for spacing */}
      <div className="flex flex-col sm:flex-row justify-center mt-1 space-y-2 sm:space-y-0 sm:space-x-2 m-2">
        {/* View University Map Button */}
        <div ref={viewUniMapButton}>
          <a
            href={"https://gucpc.in/public/pdf/UniMap_CPC.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1A556F] text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                clipRule="evenodd"
              />
            </svg>
            University Map
          </a>
        </div>

        {/* View Floor Map Button */}
        <div ref={viewFloorMapButton}>
          <a
            href={"https://gucpc.in/public/pdf/CPC_Floors_Map.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1A556F] text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <svg className="w-6 h-6 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z" clipRule="evenodd" />
            </svg>

            GUCPC Floor Map
          </a>
        </div>

      </div>

      <HomeAnimation
        videoRef={videoRef}
        titleRef={titleRef}
        aboutGUContentRef={aboutGUContentRef}
        neerjaMamRef={neerjaMamRef}
        registrarRef={registrarRef}
        aboutGUImageRef={aboutGUImageRef}
        aboutCPCImageRef={aboutCPCImageRef}
        programCardsRef={programCardsRef}
        placementImagesRef={placementImagesRef}
        activityImagesRef={activityImagesRef}
        guButtonRef={guButtonRef}
        cpcButtonRef={cpcButtonRef}
        placementButtonRef={placementButtonRef}
        activityButtonRef={activityButtonRef}
        cpcContentRef={cpcContentRef}
        gpRef={gpRef}
        viewUniMapButton={viewUniMapButton}
        viewFloorMapButton={viewFloorMapButton}
      />

      <Outlet />
      <Footer />
      <ScrollToTop />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
