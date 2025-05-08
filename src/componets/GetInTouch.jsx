import React, { useState, useRef, useEffect } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import animateButton from "../assets/animations/Button";
import dataService from "../api/dataService";
import DOMPurify from 'dompurify';
import ReactGA from 'react-ga4';
import Turnstile from 'react-turnstile';

gsap.registerPlugin(ScrollTrigger);

export default function GetInTouch() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mapRef = useRef(null);
    const addressRef = useRef(null);
    const addressItemsRef = useRef([]);
    const swcButtonRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);

    const staticDepartments = [
        {
            name: "Department of Animation",
            courses: [
                "M.Sc. IT Animation & VFX",
                "Integrated M.Sc. Animation & VFX",
                "M.Sc. IT Game Design & Development",
                "Integrated M.Sc. Game Design & Development",
                "Integrated M.Sc. IT Digital Design",
            ],
        },
        {
            name: "Department of IT IMS",
            courses: [
                "M.Sc. IT Fintech",
                "Integrated M.Sc. IT Fintech",
                "M.Sc. IT IMS & Cloud Technology",
                "Integrated M.Sc. IT IMS & Cyber Security"
            ],
        },
        {
            name: "Department of Mobile Application and Technologies",
            courses: [
                "Integrated M.Sc. IT Cloud & Application Development",
                "Integrated M.Sc. IT Architecture & Network Security",
                "M.Sc. IT Network Security",
                "M.Sc. IT Business Intelligence & Analytics",
                "M.Sc. IT Mobile App and UI",
                "Integrated M.Sc. IT Software Development (Web + Mobile)",
                "Integrated M.Sc. IT Data Management & Visual Insight",
            ],
        },
        {
            name: "Department of Aviation, Hospitality & Travel Management",
            courses: [
                "Master In International Trade & Finance",
                "Integrated MBA International Trade & Finance",
                "Integrated MBA in Aviation and Travel Management",
                "Master In Aviation Management",
                "Master In Tourism & Hospitality Management",
                "BBA In Aviation Management",
                "BBA In Tourism & Hospitality Management",
            ],
        },
        {
            name: "School of Design",
            courses: [
                "B. Design Interior and Spatial",
                "B. Design Fashion & communication",
                "B. Design New Media and entertainment",
                "B. Design Product",
                "B. Design Visual Communication",
                "B. Design UI UX",
                "B. Design Lifestyle Accessories",
                "M. Design UI UX",
            ],
        },
        {
            name: "Integrated M.B.A",
            courses: [
                "Integrated M.B.A Global Business Management",
                "Integrated M.B.A International Trade & Finance",
                "Integrated M.B.A Financial Services",
                "Masters in International Trade & Finance"
            ],
        },
    ];

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
        setSelectedCourses([]);
    };

    const handleCourseSelect = (course) => {
        setSelectedCourses(prev => {
            // If course is already selected, remove it
            if (prev.includes(course)) {
                return prev.filter(c => c !== course);
            }
            // Otherwise add it (max 2)
            return prev.length < 2 ? [...prev, course] : prev;
        });
    };

    const handleTurnstileChange = (token) => {
        setCaptchaToken(token);
        setErrors({ ...errors, captcha: null });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Validate input after user types
        if (id === 'name') {
            if (value && !/^[\w\s]*$/.test(value)) {
                setErrors({ ...errors, [id]: "Name can only contain letters, numbers, and spaces" });
            } else {
                setErrors({ ...errors, [id]: null });
            }
        } else if (id === 'number') {
            if (value && !/^\d*$/.test(value)) {
                setErrors({ ...errors, [id]: "Phone number can only contain digits" });
            } else {
                setErrors({ ...errors, [id]: null });
            }
        } else if (id === 'message') {
            if (value && !/^[\w\s]*$/.test(value)) {
                setErrors({ ...errors, [id]: "Message can only contain letters, numbers, and spaces" });
            } else {
                setErrors({ ...errors, [id]: null });
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        // Check if name is empty or has invalid characters
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!/^[\w\s]*$/.test(formData.name)) {
            newErrors.name = "Name can only contain letters, numbers, and spaces";
            isValid = false;
        }

        // Check if number is empty or has invalid characters
        if (!formData.number.trim()) {
            newErrors.number = "Phone number is required";
            isValid = false;
        } else if (!/^\d*$/.test(formData.number)) {
            newErrors.number = "Phone number can only contain digits";
            isValid = false;
        } else if (formData.number.length !== 10) {
            newErrors.number = "Phone number must be 10 digits";
            isValid = false;
        }

        // Check if message is empty or has invalid characters
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
            isValid = false;
        } else if (!/^[\w\s]*$/.test(formData.message)) {
            newErrors.message = "Message can only contain letters, numbers, and spaces";
            isValid = false;
        }

        // Check if captcha is completed
        if (!captchaToken) {
            newErrors.captcha = "Please verify that you are not a robot.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Add validation for department and courses
        if (!selectedDepartment) {
            setErrors({ ...errors, department: "Please select a department" });
            return;
        }
        if (selectedCourses.length === 0) {
            setErrors({ ...errors, courses: "Please select at least one course" });
            return;
        }

        setLoading(true);
        setFeedbackMessage("");

        try {
            ReactGA.event({
                category: 'Contact Form',
                action: 'Submit Inquiry',
                label: formData.name,
            });

            const sanitizedMessage = DOMPurify.sanitize(formData.message);
            await dataService.createInquiry({
                ...formData,
                message: sanitizedMessage,
                department: selectedDepartment.name,
                courses: selectedCourses,
            });

            // Reset form and selections
            setFormData({ name: "", number: "", message: "" });
            setSelectedDepartment(null);
            setSelectedCourses([]);
            setCaptchaToken(null);
            setFeedbackMessage(
                "Thank you for reaching out! We have received your request, and our admin team will contact you shortly."
            );
            setFeedbackType("success");

            setTimeout(() => {
                setIsModalOpen(false);
                setFeedbackMessage("");
            }, 5000);
        } catch (error) {
            setFeedbackMessage(error.message || "An error occurred");
            setFeedbackType("error");
        } finally {
            setLoading(false);
        }
    };

    const addToRefs = (el) => {
        if (el && !addressItemsRef.current.includes(el)) {
            addressItemsRef.current.push(el);
        }
    };

    useEffect(() => {
        if (swcButtonRef.current) {
            animateButton(swcButtonRef);
        }
        gsap.context(() => {
            gsap.fromTo(
                mapRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: mapRef.current,
                        start: "top 80%",
                        toggleActions: "play",
                    },
                }
            );

            addressItemsRef.current.forEach((item, index) => {
                gsap.fromTo(
                    item,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: index * 0.3,
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play",
                        },
                    }
                );
            });
        });
    }, []);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div id="get-in-touch" className="py-10 px-6 ">
            <div className="container mx-auto">
                {/* Heading */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold">Get in Touch</h2>
                    <button
                        ref={swcButtonRef}
                        onClick={handleModalToggle}
                        type="button"
                        className="text-white bg-[#1A556F]  focus:ring-5  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 m-2"
                    >
                        <svg
                            className="w-4 h-4 me-2"
                            aria-hidden="true"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                        </svg>
                        Admission Inquiry
                    </button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
                        onClick={handleModalToggle}
                    >
                        <div
                            className="relative bg-white rounded-lg shadow-lg w-full max-w-md m-4 sm:m-auto"
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxHeight: '90vh' }}
                        >
                            {/* Modal Header - Fixed */}
                            <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-6 pb-4 border-b border-gray-300">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Raise Inquiry
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:bg-gray-200 rounded-lg p-2 focus:outline-none"
                                    onClick={handleModalToggle}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
                                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                                    {/* All your form fields go here */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className={`mt-1 block w-full p-2 border rounded-md ${errors.name ? "border-red-500" : ""}`}
                                            placeholder="Enter Your Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            maxLength={50}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="number"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="number"
                                            className={`mt-1 block w-full p-2 border rounded-md ${errors.number ? "border-red-500" : ""}`}
                                            placeholder="Enter your phone number"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            maxLength={10}
                                        />
                                        {errors.number && <p className="text-red-500 text-xs">{errors.number}</p>}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            rows={4}
                                            id="message"
                                            className={`mt-1 block w-full p-2 border rounded-md ${errors.message ? "border-red-500" : ""}`}
                                            placeholder="Enter your message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            maxLength={500}
                                            required
                                        />
                                        {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                                    </div>
                                    <p className="text-sm text-gray-600">To help us direct your inquiry, please select a department and relevant courses below.</p>
                                    {/* Department Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Department
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            {staticDepartments.map((department, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleDepartmentSelect(department)}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedDepartment?.name === department.name
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <h4 className="font-medium">{department.name}</h4>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
                                    </div>

                                    {/* Course Selection - Only show if department is selected */}
                                    {selectedDepartment && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Select Courses (Max 2)
                                            </label>
                                            {selectedDepartment.courses.length === 0 ? (
                                                <p>No courses available for this department</p>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                                    {selectedDepartment.courses.map((course, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleCourseSelect(course)}
                                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedCourses.includes(course)
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "hover:bg-gray-50"
                                                                } ${selectedCourses.length >= 2 &&
                                                                    !selectedCourses.includes(course)
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                                }`}
                                                        >
                                                            <h4 className="font-medium">{course}</h4>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {errors.courses && <p className="text-red-500 text-xs">{errors.courses}</p>}
                                        </div>
                                    )}

                                    <Turnstile
                                        sitekey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
                                        onSuccess={handleTurnstileChange}
                                        theme="light"
                                    />
                                    {errors.captcha && <p className="text-red-500 text-xs">{errors.captcha}</p>}

                                    <button
                                        type="submit"
                                        className={`w-full text-white bg-[#1A556F] rounded-lg px-4 py-2 focus:outline-none ${loading ? "opacity-50 cursor-wait" : ""}`}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Submit"}
                                    </button>
                                    {feedbackMessage && (
                                        <p className={`mt-2 text-sm ${feedbackType === "success" ? "text-green-700" : "text-red-500"}`}>
                                            {feedbackMessage}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rest of the component remains unchanged */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Google Map */}
                    <div className="flex-1" ref={mapRef}>
                        <div className="w-full h-80 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d760.9630101573482!2d72.54510604289123!3d23.03870245043177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85004965c157%3A0x79090186c40fdcab!2sCentre%20for%20professional%20courses%2C%20Gujarat%20University!5e1!3m2!1sen!2sin!4v1737102760653!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map"
                            ></iframe>
                        </div>
                    </div>

                    <div className="flex-1" ref={addressRef}>
                        {/* Address section remains unchanged */}
                        <ul className="space-y-4">
                            <li className="flex items-start" ref={addToRefs}>
                                <svg
                                    className="w-12 h-8 text-gray-800 mr-3 sm:w-12 md:w-12 lg:w-12"
                                    aria-hidden="true"
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

                                <div>
                                    <h4 className="font-semibold text-start">Address</h4>
                                    <p className="text-justify text text-gray-700">
                                        Centre for Professional Courses, Maharshri Aryabhat Bhavan, Opposite
                                        EMRC Building, Gujarat University Campus, Navrangpura, Ahmedabad,
                                        Gujarat 380009.
                                    </p>
                                </div>
                            </li>
                            {/* Visiting Hours */}
                            <li className="flex items-start" ref={addToRefs}>
                                <svg
                                    className="w-6 h-6 mr-3 text-gray-800"
                                    aria-hidden="true"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-start">Visiting Hours</h4>
                                    <p className="text-gray-700">11:00 AM - 5:00 PM</p>
                                </div>
                            </li>
                            {/* E-mail */}
                            <li className="flex items-start" ref={addToRefs}>
                                <span className="text-xl mr-3">@</span>
                                <div>
                                    <h4 className="font-semibold">E-mail</h4>
                                    <a
                                        href="mailto:info.cpc@gujaratuniversity.ac.in"
                                        className="text-start text-gray-700"
                                    >
                                        info.cpc@gujaratuniversity.ac.in
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};