import React, { useEffect, useRef } from "react";
import { FaUsers, FaGraduationCap, FaClock } from 'react-icons/fa';
import gsap from 'gsap';
import ReactGA from 'react-ga4'; // Import ReactGA

export default function AcademicsHeader({ course }) {
  if (!course) return null;

  const handleViewSyllabus = () => {
    const syllabusUrl = course.pdflink;
    if (syllabusUrl) {
      ReactGA.event({
        category: 'Course',
        action: 'View Syllabus',
        label: course.name
      });
      window.open(syllabusUrl, "_blank");
    } else {
      alert("Syllabus not available for this course.");
    }
  };
  const sectionsRef = useRef([]);
  sectionsRef.current = [];

  useEffect(() => {
    sectionsRef.current.forEach((el, index) => {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.2, ease: "power3.out" });
    });

    gsap.fromTo(".syllabus-button", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: sectionsRef.current.length * 0.1, ease: "power3.out" });
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-7/12 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {course.name}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-14">
            <div className="flex flex-col items-center" ref={addToRefs}>
              <FaUsers className="text-xl text-blue-500 mb-2 sm:mb-0" />
              <p className="text-lg text-blue-500 font-medium">
                {course.totalSeats || "N/A"} Seats
              </p>
            </div>
            <div className="flex flex-col items-center" ref={addToRefs}>
              <FaGraduationCap className="text-xl text-green-500 mb-2 sm:mb-0" />
              <p className="text-lg text-green-500 font-medium">
                {course.course_type || "N/A"}
              </p>
            </div>
            <div className="flex flex-col items-center" ref={addToRefs}>
              <FaClock className="text-xl text-red-500 mb-2 sm:mb-0" />
              <p className="text-lg text-red-500 font-medium">
                {course.duration || "N/A"} Years
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleViewSyllabus}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all syllabus-button"
              style={{ backgroundColor: "#1A556F" }}
            >
              View Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}