import React, { useState, useEffect, use, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import conferenceImage from '/images/placement/PF1.jpeg';
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import ScrollToTop from '../componets/ScrollToTop';
import DataService from "../api/dataService";
import gsap from 'gsap';
import ReactGA from 'react-ga4';
import dataService from '../api/dataService';

const getAllVerticalPromise = DataService.getVerticals();

export default function Placement() {
  const [activeVertical, setActiveVertical] = useState(null);
  const [activeVerticalName, setActiveVerticalName] = useState('');
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const studentsPerPage = 9;

  // State for popup forms
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  const [isStudentFormSubmitting, setStudentFormSubmitting] = useState(false);
  const [isCompanyFormSubmitting, setCompanyFormSubmitting] = useState(false);

  const semesters = [
    "Master Semester 1",
    "Master Semester 2",
    "Master Semester 3",
    "Master Semester 4",
    "Integrated Semester 6",
    "Integrated Semester 7",
    "Integrated Semester 8",
    "Integrated Semester 9",
    "Integrated Semester 10",
  ]

  // Add validation state
  const [studentFormErrors, setStudentFormErrors] = useState({
    enrollmentNo: '',
    studentName: '',
    companyNames: '',
    semester: '' // Add this line
  });

  const [companyFormErrors, setCompanyFormErrors] = useState({
    companyName: '',
    jobDescription: '',
    hrEmail: '',
    jobDescriptionFile: '',
    hrNumber: ''

  });

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // State for available courses
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Update the studentFormData state to include name fields
  const [studentFormData, setStudentFormData] = useState({
    vertical: '',
    verticalName: '',
    course: '',
    courseName: '',
    semester: '',
    enrollmentNo: '',
    studentName: '',
    companyNames: '',
  });

  // Company form state
  const [companyFormData, setCompanyFormData] = useState({
    companyName: '',
    jobDescription: '',
    jobDescriptionFile: null,
    hrEmail: '',
    hrNumber: '',
  });

  // Create utility validation functions first
  const containsOnlyAllowedChars = (value) => {
    // Allow chars, spaces, ampersands and commas
    const regex = /^[a-zA-Z\s&,]*$/;
    return regex.test(value);
  };

  const validateMaxWords = (value, maxWords, maxCharsPerWord) => {
    if (!value) return true;

    const words = value.trim().split(/\s+/);

    if (words.length > maxWords) {
      return { valid: false, message: `Maximum ${maxWords} words allowed` };
    }

    for (const word of words) {
      if (word.length > maxCharsPerWord) {
        return { valid: false, message: `Each word must be maximum ${maxCharsPerWord} characters` };
      }
    }

    return { valid: true };
  };

  const validateCompanyNames = (value) => {
    if (!value) return true;

    const companies = value.split(',').map(company => company.trim()).filter(company => company !== '');

    if (companies.length > 5) {
      return { valid: false, message: 'Maximum 5 companies allowed' };
    }

    for (const company of companies) {
      const wordResult = validateMaxWords(company, 5, 20);
      if (!wordResult.valid) {
        return wordResult;
      }
    }

    return { valid: true };
  };


  const studentsGridRef = useRef(null);
  const verticalsRef = useRef(null); // Add a ref for the vertical tabs

  useEffect(() => {
    if (!isLoading && students.length > 0) {
      if (studentsGridRef.current) {
        gsap.from(studentsGridRef.current.children, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    }
  }, [isLoading, students]);

  const verticalResponse = use(getAllVerticalPromise);
  const verticals = verticalResponse.data.filter((vertical) => vertical.name !== "Staff");

  useEffect(() => {
    if (verticals && verticals.length > 0 && !activeVertical) {
      setActiveVertical(verticals[0]._id);
      setActiveVerticalName(verticals[0].name);
    }
  }, [verticals]);

  const images = [
    "/images/placement/PF2.jpeg",
    "/images/placement/PF3.jpeg",
    "/images/placement/PF4.jpeg",
    "/images/placement/PF5.jpeg",
    "/images/placement/PF7.jpeg",
    "/images/placement/PF9.JPG",
    "/images/placement/PF10.JPG",
    "/images/placement/PF11.JPG",
  ];

  useEffect(() => {
    const loadStudents = async () => {
      if (activeVertical) {
        setIsLoading(true);
        try {
          const response = await DataService.getStudentVerticals(activeVertical);
          setStudents(response.data || []);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error loading students:", error);
          setStudents([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadStudents();
  }, [activeVertical]);

  // Update the loadCourses function to handle the first course selection
  const loadCourses = async (verticalId) => {
    if (!verticalId) return;

    setLoadingCourses(true);
    try {
      const response = await DataService.getAcademicData(verticalId);
      if (response.status === "success" && response.data.courses && response.data.courses.length > 0) {
        setAvailableCourses(response.data.courses);

        // Automatically select the first course and its name
        const firstCourse = response.data.courses[0];
        setStudentFormData(prev => ({
          ...prev,
          course: firstCourse._id,
          courseName: firstCourse.name
        }));
      } else {
        setAvailableCourses([]);
        console.error("No courses found for this vertical");
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      setAvailableCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePaginationClick = (newPage, label) => {
    setCurrentPage(newPage);
    ReactGA.event({
      category: 'Placement',
      action: 'Pagination Click',
      label: label,
    });
    if (verticalsRef.current) {
      verticalsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update the handleStudentFormChange function to validate semester
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;

    // Common character validation for all text fields
    if ((name === 'studentName' || name === 'companyNames') && !containsOnlyAllowedChars(value)) {
      setStudentFormErrors(prev => ({
        ...prev,
        [name]: 'Only letters, spaces, ampersands (&) and commas (,) are allowed'
      }));
      return; // Don't update form if invalid characters
    }

    // For vertical and course selections, store both ID and name
    if (name === "vertical") {
      // Find the selected vertical's name from the verticals array
      const selectedVertical = verticals.find(v => v._id === value);

      setStudentFormData(prev => ({
        ...prev,
        vertical: value,
        verticalName: selectedVertical ? selectedVertical.name : '',
        // Reset course when vertical changes
        course: '',
        courseName: ''
      }));

      // Load courses for the selected vertical
      loadCourses(value);
    }
    else if (name === "course") {
      // Find the selected course's name from the availableCourses array
      const selectedCourse = availableCourses.find(c => c._id === value);

      setStudentFormData(prev => ({
        ...prev,
        course: value,
        courseName: selectedCourse ? selectedCourse.name : ''
      }));
    }
    else {
      // For other fields, update normally
      setStudentFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Field-specific validations
    if (name === 'enrollmentNo') {
      if (value && value.length > 13) {
        setStudentFormErrors(prev => ({
          ...prev,
          enrollmentNo: 'Enrollment number cannot exceed 13 digits'
        }));
      } else {
        setStudentFormErrors(prev => ({
          ...prev,
          enrollmentNo: ''
        }));
      }
    }
    else if (name === 'studentName') {
      const nameValidation = validateMaxWords(value, 5, 20);
      setStudentFormErrors(prev => ({
        ...prev,
        studentName: !nameValidation.valid ? nameValidation.message : ''
      }));
    }
    else if (name === 'companyNames') {
      const companyValidation = validateCompanyNames(value);
      setStudentFormErrors(prev => ({
        ...prev,
        companyNames: !companyValidation.valid ? companyValidation.message : ''
      }));
    }
    else if (name === 'semester') {
      setStudentFormErrors(prev => ({
        ...prev,
        semester: value === '' ? 'Please select a semester' : ''
      }));
    }
  };
  // Update handleStudentFormSubmit to validate all fields before submission
  const handleStudentFormSubmit = async (e) => {
    e.preventDefault();

    // First validate all required fields
    let newErrors = { ...studentFormErrors };

    // Check semester
    if (studentFormData.semester === '') {
      newErrors.semester = 'Please select a semester';
    }

    // Set the updated errors
    setStudentFormErrors(newErrors);

    // Check for any validation errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (hasErrors) {
      console.log('Cannot submit form - validation errors exist');
      return;
    }
    setStudentFormSubmitting(true);
    // console.log('Student form submitted:', studentFormData);
    // Here you would normally submit this data to your backend
    try {
      const data = await dataService.studentInquiry(studentFormData);
    } catch (error) {
    } finally {
      setStudentFormSubmitting(false);
    }

    // Track form submission
    ReactGA.event({
      category: 'Placement',
      action: 'Student Inquiry Form Submit',
      label: studentFormData.studentName,
    });

    // Reset form and close popup
    setStudentFormData({
      vertical: '',
      verticalName: '',
      course: '',
      courseName: '',
      semester: '',
      enrollmentNo: '',
      studentName: '',
      companyNames: '',
    });
    setAvailableCourses([]);
    setShowStudentForm(false);
  };

  // Enhanced company form change handler with validation
  const handleCompanyFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'jobDescriptionFile') {
      if (files && files[0]) {
        const file = files[0];

        // Check file type
        if (file.type !== 'application/pdf') {
          setCompanyFormErrors(prev => ({
            ...prev,
            jobDescriptionFile: 'Only PDF files are allowed'
          }));
          return;
        }

        // Check file size (4.5MB limit)
        if (file.size > 4.5 * 1024 * 1024) { // 4.5MB in bytes
          setCompanyFormErrors(prev => ({
            ...prev,
            jobDescriptionFile: 'File size must be less than 4.5MB'
          }));
          return;
        }

        // If valid, clear errors and set file
        setCompanyFormErrors(prev => ({
          ...prev,
          jobDescriptionFile: ''
        }));
        setCompanyFormData({
          ...companyFormData,
          [name]: file
        });
      }
    } else {
      // Existing validation for other fields
      if ((name === 'companyName' || name === 'jobDescription') && !containsOnlyAllowedChars(value)) {
        setCompanyFormErrors(prev => ({
          ...prev,
          [name]: 'Only letters, spaces, ampersands (&) and commas (,) are allowed'
        }));
        return;
      }

      setCompanyFormData({
        ...companyFormData,
        [name]: value
      });

      // Existing field-specific validations
      if (name === 'companyName') {
        const nameValidation = validateMaxWords(value, 5, 20);
        setCompanyFormErrors(prev => ({
          ...prev,
          companyName: !nameValidation.valid ? nameValidation.message : ''
        }));
      }
      else if (name === 'jobDescription') {
        const descValidation = validateMaxWords(value, 600, 20);
        setCompanyFormErrors(prev => ({
          ...prev,
          jobDescription: !descValidation.valid ? descValidation.message : ''
        }));
      }
      else if (name === 'hrEmail') {
        if (value && !isValidEmail(value)) {
          setCompanyFormErrors(prev => ({
            ...prev,
            hrEmail: 'Please enter a valid email address'
          }));
        } else {
          setCompanyFormErrors(prev => ({
            ...prev,
            hrEmail: ''
          }));
        }
      }
      else if (name === 'hrNumber') {
        if (value && !/^[0-9]{10}$/.test(value)) {
          setCompanyFormErrors(prev => ({
            ...prev,
            hrNumber: 'Phone number must be exactly 10 digits'
          }));
        } else {
          setCompanyFormErrors(prev => ({
            ...prev,
            hrNumber: ''
          }));
        }
      }
    }
  };

  const handleCompanyFormSubmit = async (e) => {
    e.preventDefault();

    // Check for any validation errors
    const hasErrors = Object.values(companyFormErrors).some(error => error !== '');

    if (hasErrors) {
      console.log('Cannot submit form - validation errors exist');
      return;
    }

    // Additional check if file exists and is valid
    if (companyFormData.jobDescriptionFile) {
      const file = companyFormData.jobDescriptionFile;
      if (file.size > 4.5 * 1024 * 1024) {
        setCompanyFormErrors(prev => ({
          ...prev,
          jobDescriptionFile: 'File size must be less than 4.5MB'
        }));
        return;
      }
      if (file.type !== 'application/pdf') {
        setCompanyFormErrors(prev => ({
          ...prev,
          jobDescriptionFile: 'Only PDF files are allowed'
        }));
        return;
      }
    }
    setCompanyFormSubmitting(true)
    const formDataToSend = new FormData();
    formDataToSend.append("companyName", companyFormData.companyName);
    formDataToSend.append("jobDescription", companyFormData.jobDescription);
    formDataToSend.append("hrEmail", companyFormData.hrEmail);
    formDataToSend.append("hrNumber", companyFormData.hrNumber); // Add this line
    if (companyFormData.jobDescriptionFile && typeof companyFormData.jobDescriptionFile !== "string") {
      formDataToSend.append("jobDescriptionFile", companyFormData.jobDescriptionFile);
    }
    console.log(formDataToSend);

    try {
      const data = await dataService.companyInquiry(formDataToSend);
    }
    catch (error) {

    } finally {
      setCompanyFormSubmitting(false);
    }

    // Track form submission
    ReactGA.event({
      category: 'Placement',
      action: 'Company Inquiry Form Submit',
      label: companyFormData.companyName,
    });

    // Reset form and close popup
    setCompanyFormData({
      companyName: '',
      jobDescription: '',
      jobDescriptionFile: null,
      hrEmail: '', // Add this line
    });
    setShowCompanyForm(false);
  };

  // Also update the handleOpenStudentForm function to set the initial vertical name
  const handleOpenStudentForm = () => {
    // Set default vertical to first in list if available
    if (verticals && verticals.length > 0) {
      const defaultVertical = verticals[0];
      setStudentFormData({
        ...studentFormData,
        vertical: defaultVertical._id,
        verticalName: defaultVertical.name
      });
      loadCourses(defaultVertical._id);
    }
    setShowStudentForm(true);
    ReactGA.event({
      category: 'Placement',
      action: 'Student Inquiry Button Click',
    });
  };

  return (
    <div className="w-full bg-white text-black">
      <Header />
      <section
        className="bg-center bg-cover bg-no-repeat bg-blend-multiply"
        style={{ backgroundImage: `url(${conferenceImage})` }}
      >
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56"></div>
      </section>

      <div className="py-5 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-center mb-6">Student Success</h2>

        <ul ref={verticalsRef} className="flex flex-wrap justify-center gap-2 mb-6">
          {verticals && verticals.map((vertical) => (
            <li key={vertical._id}>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${activeVertical === vertical._id ? 'bg-[#1A556F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => {
                  ReactGA.event({
                    category: 'Placement',
                    action: 'Vertical Tab Click',
                    label: vertical.name,
                  });
                  setActiveVertical(vertical._id);
                  setActiveVerticalName(vertical.name);
                }}
              >
                {vertical.name}
              </button>
            </li>
          ))}
        </ul>

        {isLoading ? (
          <div className="text-center py-8">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No students placed from {activeVerticalName}
          </div>
        ) : (
          <>
            <div ref={studentsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentStudents.map((student, index) => (
                <div key={student._id || index} className="bg-gray-100 p-4 text-center rounded-lg shadow-md">
                  {student.student_image_url ? (
                    <img
                      src={student.student_image_url}
                      alt={student.student_name}
                      className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                    />
                  ) : (
                    <svg
                      className="w-24 h-24 mx-auto text-gray-800"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{student.student_name}</h3>
                  <p className="text-gray-700 mb-1">Company: {student.company_name}</p>
                  <p className="text-gray-700">Package: {student.package}</p>
                  <p className="text-gray-700">Year: {student.year}</p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePaginationClick(Math.max(currentPage - 1, 1), 'Previous Page')}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePaginationClick(i + 1, `Page ${i + 1}`)}
                    className={`w-10 h-10 rounded-lg ${currentPage === i + 1 ? 'bg-[#1A556F] text-white' : 'bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePaginationClick(Math.min(currentPage + 1, totalPages), 'Next Page')}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Section of inquiry for placement of students - popup form */}
      <div className="py-5 px-6 md:px-20 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-3">Student Placement Opportunity Inquiry</h3>
            <p className="text-gray-600">GUCPC Student, Interested in a placement opportunity? Fill out the form to share your preferred companies and details. We'll assist you in finding the right opportunity.</p>
          </div>
          <button
            onClick={handleOpenStudentForm}
            className="w-full md:w-auto bg-[#1A556F] text-white px-6 py-3 rounded-lg hover:bg-[#134056] transition-colors"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* New Section of inquiry for placement of company - popup form */}
      <div className="py-5 px-6 md:px-20 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-3">Companies Looking to Hire</h3>
            <p className="text-gray-600">If you're a company interested in recruiting our talented students, please fill out the form.</p>
          </div>
          <button
            onClick={() => {
              setShowCompanyForm(true);
              ReactGA.event({
                category: 'Placement',
                action: 'Company Inquiry Button Click',
              });
            }}
            className="w-full md:w-auto bg-[#1A556F] text-white px-6 py-3 rounded-lg hover:bg-[#134056] transition-colors"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* Placement Job Fair Section */}
      <div className="py-10 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-center mb-6">
          Placement Job Fair
        </h2>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          style={{ height: '500px' }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Student Form Modal - Updated with validation */}
      {showStudentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">Student Placement Opportunity Inquiry</h3>
              <button
                onClick={() => setShowStudentForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <form onSubmit={handleStudentFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="vertical" className="block text-sm font-medium text-gray-700 mb-1">Select Vertical</label>
                  <select
                    id="vertical"
                    name="vertical"
                    value={studentFormData.vertical}
                    onChange={handleStudentFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {verticals.map((vertical) => (
                      <option key={vertical._id} value={vertical._id}>
                        {vertical.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                  <select
                    id="course"
                    name="course"
                    value={studentFormData.course}
                    onChange={handleStudentFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loadingCourses || availableCourses.length === 0}
                  >
                    {loadingCourses ? (
                      <option value="">Loading courses...</option>
                    ) : availableCourses.length === 0 ? (
                      <option value="">Select a vertical first</option>
                    ) : (
                      availableCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))
                    )}
                  </select>
                  {loadingCourses && (
                    <p className="text-xs text-gray-500 mt-1">Loading available courses...</p>
                  )}
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Select Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    value={studentFormData.semester}
                    onChange={handleStudentFormChange}
                    className={`w-full border ${studentFormErrors.semester ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  >
                    <option value="">Select a Semester</option>
                    {
                      semesters.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))
                    }
                  </select>
                  {studentFormErrors.semester && (
                    <p className="text-red-500 text-xs mt-1">{studentFormErrors.semester}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="enrollmentNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Number
                  </label>
                  <input
                    type="number"
                    id="enrollmentNo"
                    name="enrollmentNo"
                    value={studentFormData.enrollmentNo}
                    onChange={handleStudentFormChange}
                    className={`w-full border ${studentFormErrors.enrollmentNo ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    required
                    maxLength={13}
                  />
                  {studentFormErrors.enrollmentNo && (
                    <p className="text-red-500 text-xs mt-1">{studentFormErrors.enrollmentNo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={studentFormData.studentName}
                    onChange={handleStudentFormChange}
                    className={`w-full border ${studentFormErrors.studentName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {studentFormErrors.studentName && (
                    <p className="text-red-500 text-xs mt-1">{studentFormErrors.studentName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyNames" className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Company Names (max 5, comma separated)
                  </label>
                  <textarea
                    id="companyNames"
                    name="companyNames"
                    value={studentFormData.companyNames}
                    onChange={handleStudentFormChange}
                    className={`w-full border ${studentFormErrors.companyNames ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    rows="3"
                    placeholder="e.g. Creast Data, TechDefenders, Cybercom"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Enter up to 5 company names, separated by commas</p>
                  {studentFormErrors.companyNames && (
                    <p className="text-red-500 text-xs mt-1">{studentFormErrors.companyNames}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleStudentFormSubmit}
                  className="px-4 py-2 bg-[#1A556F] text-white rounded-md hover:bg-[#134056] transition-colors"
                  disabled={Object.values(studentFormErrors).some(error => error !== '')}
                >
                  {isStudentFormSubmitting ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Form Modal - Updated with validation */}
      {showCompanyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" style={{ maxHeight: '90vh' }}>
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">Enter Job Description</h3>
              <button
                onClick={() => setShowCompanyForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 73px)' }}>
              <form onSubmit={handleCompanyFormSubmit} className="p-6">
                <div className="mb-4">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companyFormData.companyName}
                    onChange={handleCompanyFormChange}
                    className={`w-full border ${companyFormErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                    required
                  />
                  {companyFormErrors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{companyFormErrors.companyName}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="hrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    HR Email
                  </label>
                  <input
                    type="email"
                    id="hrEmail"
                    name="hrEmail"
                    value={companyFormData.hrEmail}
                    onChange={handleCompanyFormChange}
                    className={`w-full border ${companyFormErrors.hrEmail ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                    required
                  />
                  {companyFormErrors.hrEmail && (
                    <p className="text-red-500 text-xs mt-1">{companyFormErrors.hrEmail}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="hrNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    HR Phone Number
                  </label>
                  <input
                    type="tel"
                    id="hrNumber"
                    name="hrNumber"
                    value={companyFormData.hrNumber}
                    onChange={handleCompanyFormChange}
                    className={`w-full border ${companyFormErrors.hrNumber ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    minLength={10}
                  />
                  {companyFormErrors.hrNumber && (
                    <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={companyFormData.jobDescription}
                    onChange={handleCompanyFormChange}
                    className={`w-full border ${companyFormErrors.jobDescription ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                    rows="4"
                  ></textarea>
                  {companyFormErrors.jobDescription && (
                    <p className="text-red-500 text-xs mt-1">{companyFormErrors.jobDescription}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="jobDescriptionFile" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Job Description (PDF only, max 4.5MB)
                  </label>
                  <input
                    type="file"
                    id="jobDescriptionFile"
                    name="jobDescriptionFile"
                    onChange={handleCompanyFormChange}
                    accept=".pdf"
                    className={`w-full border ${companyFormErrors.jobDescriptionFile ? 'border-red-500' : 'border-gray-300'
                      } rounded-md px-3 py-2`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Only PDF files under 4.5MB are allowed</p>
                  {companyFormErrors.jobDescriptionFile && (
                    <p className="text-red-500 text-xs mt-1">{companyFormErrors.jobDescriptionFile}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompanyForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1A556F] text-white rounded-md hover:bg-[#134056]"
                    disabled={
                      Object.values(companyFormErrors).some(error => error !== '') ||
                      (!companyFormData.companyName || !companyFormData.hrEmail) // Basic required field check
                    }
                  >
                    {isCompanyFormSubmitting ? 'Loading...' : 'Submit'}
                  </button>
                </div>
              </form>


            </div>

          </div>
        </div>

      )}

      <Footer />
      <ScrollToTop />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}