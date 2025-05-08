import React, { useEffect, useState, useRef, useMemo } from "react";

import ReactGA from 'react-ga4'; // Import ReactGA

import DataService from "../api/dataService";
import Header from "../componets/Header";
import Footer from "../componets/Footer";
import ScrollToTop from "../componets/ScrollToTop";
import "../assets/css/Swiper.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import abtImg from '/images/newimg.jpg';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default function Academics() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [facultyLoading, setFacultyLoading] = useState(false); // Add faculty loading state
  const navigate = useNavigate();
  const hoverTimelines = useRef({});
  const coursesGridRef = useRef(null);

  const handleMouseEnter = (e, courseId) => {
    const target = e.currentTarget;
    if (!hoverTimelines.current[courseId]) {
      hoverTimelines.current[courseId] = gsap.timeline({ paused: true });
      hoverTimelines.current[courseId].to(target, {
        scale: 1.03,
        y: -3,
        duration: 0.2,
        ease: "power3.out",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)", // Add a subtle shadow
        border: "2px solid #2C3E50", // Add the hover border
      });
    }
    hoverTimelines.current[courseId].play();
  };

  const handleMouseLeave = (e, courseId) => {
    const target = e.currentTarget;
    if (hoverTimelines.current[courseId]) {
      hoverTimelines.current[courseId].reverse();
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (courses.length > 0 && coursesGridRef.current) {
        const cards = courses.map(course => `.course-card-${course._id}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: coursesGridRef.current,
              start: "top center+=100",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, coursesGridRef); // scope the context to the coursesGridRef

    return () => ctx.revert(); // proper cleanup
  }, [courses]);

  const location = useLocation();

  // Get the selected department from location state
  const selectedDepartmentFromHome = location.state?.department;

  useEffect(() => {
    Promise.all([
      DataService.getVerticals(),
      // You can add more API calls here if needed 
    ])
      .then(([departmentsData]) => {
        const filteredDepartments = (departmentsData.data || []).filter(dept => dept.name !== "Staff");
        setDepartments(filteredDepartments);

        if (selectedDepartmentFromHome) {
          const matchedDept = filteredDepartments.find(dept => dept.name === selectedDepartmentFromHome);
          if (matchedDept) {
            setSelectedDept(matchedDept);
            return;
          }
        }

        if (filteredDepartments.length > 0) {
          setSelectedDept(filteredDepartments[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later."); // Set error message
      })
      .finally(() => setLoading(false)); // Hide loading indicator regardless of success/failure
  }, [selectedDepartmentFromHome]);

  useEffect(() => {
    if (selectedDept) {
      setFacultyLoading(true); // Set faculty loading to true before fetching
      DataService.getAcademicData(selectedDept._id)
        .then((data) => {
          setCourses(data.data.courses || []);

          // Get faculty data
          const facultyData = data.data.faculty || [];

          // Sort faculty to prioritize Dr. Rajesh Khatri
          const sortedFaculty = sortFacultyWithPriority(facultyData, "Dr. Rajesh Khatri");
          setFaculty(sortedFaculty);
        })
        .catch((error) => {
          console.error("Error fetching academic data:", error);
          setError("Error fetching academic data. Please try again later.");
        })
        .finally(() => {
          setFacultyLoading(false); // Set faculty loading to false after fetching
          setLoading(false); // Make sure general loading is also false.
        });
    }
  }, [selectedDept]);

  // Function to prioritize specific faculty member
  const sortFacultyWithPriority = (facultyList, priorityName) => {
    if (!facultyList || facultyList.length === 0) return [];

    // Find the index of Dr. Rajesh Khatri
    const priorityIndex = facultyList.findIndex(faculty =>
      faculty.name === priorityName ||
      faculty.name.includes(priorityName) ||
      faculty.name.includes("Rajesh Khatri")
    );

    // If found, move to the beginning of the array
    if (priorityIndex !== -1) {
      const priorityFaculty = facultyList[priorityIndex];
      const filteredFaculty = facultyList.filter((_, index) => index !== priorityIndex);
      return [priorityFaculty, ...filteredFaculty];
    }

    // If not found, return original list
    return facultyList;
  };

  const handleCourseClick = (course) => {
    ReactGA.event({
      category: 'Course',
      action: 'Select Course',
      label: `Course: ${course.name}`
    });
  };

  if (loading) {
    return (<div className="p-4">
      {error && (
        <div className="mb-4 p-3 text-red-500 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <span className="font-bold mr-2">Error:</span> {error}
          </div>
        </div>
      )}
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    </div>);
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>; // Display error message
  }

  return (
    <div>
      <Header transparent={false} />

      {/* Main Image */}
      <div className="relative mx-auto">
        <section
          className="bg-no-repeat bg-cover bg-center bg-blend-multiply"
          style={{ backgroundImage: `url(${abtImg})`, height: '86vh', minHeight: '300px' }}
        >
        </section>
      </div>

      {/* Department Title */}
      <div className="container mx-auto px-4 mt-4">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
          {selectedDept?.name || "Department"} Courses
        </h1>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-8" ref={coursesGridRef}>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`course-card-${course._id} p-5 rounded-lg shadow-md transition-all duration-300`}
                onClick={() => handleCourseClick(course)}
                style={{ opacity: 0, transform: 'translateY(20px)' }}
                onMouseEnter={(e) => handleMouseEnter(e, course._id)}
                onMouseLeave={(e) => handleMouseLeave(e, course._id)}
              >
                {/* Course Header */}
                <div className="mb-2">
                  <h3 className="font-bold text-xl text-gray-800 mb-1">{course.name}</h3>
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-4">
                  {/* Description */}
                  {/* <p className="text-sm text-gray-600 mb-3">
                    {course.description ? (
                      course.description.length > 100
                        ? `${course.description.substring(0, 100)}...`
                        : course.description
                    ) : "No description available"}
                  </p> */}

                  {/* Course Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {/* Duration */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="">{course.duration || course.years || "N/A"} Years</span>
                    </div>

                    {/* Seats */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{course.totalSeats || "N/A"} Seats</span>
                    </div>

                    {/* Difficulty or Level */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>{course.course_type || "N/A"}</span>
                    </div>

                    {/* Fees*/}
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-gray-500 mr-1 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="40 -1 170 250">
                        <path fill="#808080" d="M153 23h41l15-23H55L40 23h26c27 0 52 2 62 25H55L40 71h91v1c0 17-14 43-60 43H48v22l90 113h41L85 133c39-2 75-24 80-62h29l15-23h-45c-1-9-5-18-11-25z" />
                      </svg>
                      <div className="whitespace-pre-line">
                        {course.fees || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Action - Centered View Syllabus Button */}
                <div className="flex justify-center mt-4">
                  {course.pdflink ? (
                    <a
                      href={course.pdflink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-md font-medium text-sm transition-colors bg-[#1A556F] hover:bg-[#2C3E50] text-white cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        ReactGA.event({
                          category: 'Course',
                          action: 'View Syllabus',
                          label: `Course: ${course.name}`
                        });
                      }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      View Syllabus
                    </a>
                  ) : (
                    <span className="px-6 py-2 rounded-md font-medium text-sm bg-gray-300 text-gray-600 cursor-default">
                      N/A
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="container pb-12 mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-medium mt-12 mb-8 text-gray-800">Faculty Members</h2>
        {/* Conditional Rendering for Faculty Swiper */}
        {facultyLoading ? (
          <div className="text-center py-8">Loading Faculty Members...</div> // Display loading message
        ) : faculty.length > 0 ? (
          <FacultySwiper faculty={faculty} />
        ) : (
          <div className="text-center py-8">No faculty found for this department.</div>
        )}
      </div>
      <Footer />
      <ScrollToTop />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

// Faculty Swiper Component
const FacultySwiper = ({ faculty }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const [imageLoading, setImageLoading] = useState({}); // Track image loading for each faculty

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleImageLoad = (facultyId) => {
    setImageLoading((prev) => ({ ...prev, [facultyId]: false }));
  };

  const handleImageError = (facultyId) => {
    setImageLoading((prev) => ({ ...prev, [facultyId]: false }));
  };

  const handleViewProfileClick = (faculty) => {
    ReactGA.event({
      category: 'Faculty',
      action: 'Click View Profile',
      label: `Faculty: ${faculty.name}`
    });
    navigate(`/faculty/${faculty._id}`, { state: { faculty } });
  };

  return (
    <div className="flex justify-center items-center h-[300px] md:h-[600px] lg:h-[500px] relative">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Navigation]}
        className="w-full max-w-6xl swiper-container"
        onSlideChange={handleSlideChange}
        touchRatio={0.2}
        touchAngle={45}
        simulateTouch={true}
        initialSlide={0} // Start with the first slide (Dr. Rajesh Khatri)
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 0 },
          480: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 40 },
          1440: { slidesPerView: 3, spaceBetween: 60 },
        }}
      >
        {faculty.map((faculty, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div
              className={`bg-gray-100 overflow-hidden w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transform transition-all duration-300 ${index === activeIndex ? "opacity-100 blur-0 scale-105" : "opacity-60 blur-sm scale-95"
                }`}
            >
              {/* Image Container */}
              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden relative">
                {imageLoading[faculty._id] !== false && (
                  <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
                  </div>
                )}
                <img
                  src={faculty.profileImageUrl}
                  alt={faculty.name}
                  className={`w-full h-full object-cover object-top ${imageLoading[faculty._id] !== false ? "opacity-0" : "opacity-100"
                    }`}
                  onLoad={() => handleImageLoad(faculty._id)}
                  onError={() => handleImageError(faculty._id)}
                />
              </div>

              {/* Faculty Name and Position */}
              <div className="p-4">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">
                  {faculty.name}
                </div>
                <div className="text-sm text-gray-600 text-center mb-2">{faculty.position}</div>
              </div>

              {index === activeIndex && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleViewProfileClick(faculty)}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all"
                  >
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev absolute left-0 z-10 ml-2 md:ml-4 lg:ml-8 xl:ml-12">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div className="swiper-button-next absolute right-0 z-10 mr-2 md:mr-4 lg:mr-8 xl:mr-12">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};