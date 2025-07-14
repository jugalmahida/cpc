import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ReactGA from 'react-ga4';
import DataService from '../api/dataService';

const AdmissionRegistrationFloatingButton = () => {
    // State Management
    const [isGlowing, setIsGlowing] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedExamDate, setSelectedExamDate] = useState('');
    const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

    // Form Data & Errors
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        profileImage: null,
        pdf: null,
        tID: '',
        gcasNumber: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        mobile: '',
        profileImage: '',
        pdf: '',
        tID: '',
        department: '',
        courses: '',
        examDate: '',
        gcasNumber: ''
    });

    // Refs for GSAP Animations
    const overlayRef = useRef(null);
    const popupRef = useRef(null);
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const footerRef = useRef(null);

    // Exam Dates Data
    const examDates = [
        { id: 1, date: 'Sunday, 20-07-2025', value: '2025-07-20' },
        // { id: 2, date: 'Tuesday, 24-06-2025', value: '2025-06-24' }
    ];

    // Department Data
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
    ];

    // Animation Handlers
    const openForm = () => {
        setShowForm(true);
        ReactGA.event({ category: 'Admission', action: 'Apply Now Clicked' });
    };

    const closeForm = () => {
        const tl = gsap.timeline({
            onComplete: () => setShowForm(false)
        });

        tl.to([footerRef.current, contentRef.current], { y: 20, opacity: 0, duration: 0.2 });
        tl.to(headerRef.current, { y: -20, opacity: 0, duration: 0.2 }, "-=0.1");
        tl.to(popupRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: "back.in(1.7)" }, "-=0.1");
        tl.to(overlayRef.current, { backgroundColor: "rgba(0,0,0,0)", duration: 0.3 }, "-=0.2");
    };

    // Animation Setup
    useEffect(() => {
        if (showForm && overlayRef.current && popupRef.current) {
            const tl = gsap.timeline();
            gsap.set(overlayRef.current, { backgroundColor: "rgba(0,0,0,0)" });
            gsap.set(popupRef.current, { scale: 0.5, opacity: 0, rotationX: 15 });
            gsap.set([headerRef.current, contentRef.current, footerRef.current], { opacity: 0, y: 30 });

            tl.to(overlayRef.current, { backgroundColor: "rgba(0,0,0,0.5)", duration: 0.4, ease: "power2.out" });
            tl.to(popupRef.current, { scale: 1, opacity: 1, rotationX: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.2");
            tl.to(headerRef.current, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");
            tl.to(contentRef.current, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
            tl.to(footerRef.current, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
        }
    }, [showForm]);

    // Glowing Effect
    useEffect(() => {
        const glowInterval = setInterval(() => setIsGlowing(prev => !prev), 1000);
        return () => clearInterval(glowInterval);
    }, []);

    // Department/Course Selection
    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
        setSelectedCourses([]);
        setFormErrors(prev => ({ ...prev, department: null }));
    };

    const handleCourseSelect = (course) => {
        setSelectedCourses(prev => {
            if (prev.includes(course)) return []; // Deselect if already selected
            return [course]; // Always replace with the new selection
        });
        setFormErrors(prev => ({ ...prev, courses: null }));
    };

    // Exam Date Selection
    const handleExamDateSelect = (examDate) => {
        setSelectedExamDate(examDate);
        setFormErrors(prev => ({ ...prev, examDate: null }));
    };

    // Validation Helpers
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

    // Enhanced File Validation
    const validateFileSize = (file, maxSizeMB = 1, minSizeKB = 50) => {
        if (!file) return null;

        const fileSizeKB = file.size / 1024;
        const fileSizeMB = fileSizeKB / 1024;

        if (fileSizeMB > maxSizeMB) {
            return `File size (${fileSizeMB.toFixed(2)} MB) exceeds the maximum limit of ${maxSizeMB} MB`;
        }

        if (fileSizeKB < minSizeKB) {
            return `File size (${fileSizeKB.toFixed(2)} KB) is smaller than the minimum requirement of ${minSizeKB} KB`;
        }

        return null;
    };

    const validateFileType = (file, acceptedTypes) => {
        if (!file) return null;

        if (!acceptedTypes.includes(file.type)) {
            const typeNames = acceptedTypes.map(type => {
                return type.replace('application/', '').replace('image/', '').toUpperCase();
            }).join('/');

            return `Invalid file type. Please upload a ${typeNames} file`;
        }

        return null;
    };

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            let error = '';

            if (name === 'profileImage') {
                const sizeError = validateFileSize(file);
                const typeError = validateFileType(file, ['image/jpeg', 'image/png']);
                error = sizeError || typeError || '';
            }
            else if (name === 'pdf') {
                const sizeError = validateFileSize(file);
                const typeError = validateFileType(file, ['application/pdf']);
                error = sizeError || typeError || '';
            }

            setFormErrors(prev => ({ ...prev, [name]: error }));
            setFormData(prev => ({ ...prev, [name]: error ? null : file }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        switch (name) {
            case 'name':
                setFormErrors(prev => ({ ...prev, name: value.length < 3 ? 'Name must be at least 3 characters' : '' }));
                break;
            case 'email':
                setFormErrors(prev => ({ ...prev, email: !isValidEmail(value) ? 'Invalid email address' : '' }));
                break;
            case 'number':
                setFormErrors(prev => ({ ...prev, mobile: !isValidMobile(value) ? 'Invalid mobile number (10 digits)' : '' }));
                break;
            case 'gcasNumber':
                setFormErrors(prev => ({ ...prev, gcasNumber: !value.trim() ? 'GCAS Registration Number is required' : '' }));
                break;
            case 'tID':
                setFormErrors(prev => ({ ...prev, tID: !value.trim() ? 'Transaction ID is required' : '' }));
                break;
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!isValidEmail(formData.email)) errors.email = 'Invalid email';
        if (!isValidMobile(formData.number)) errors.mobile = 'Invalid mobile number';
        if (!formData.gcasNumber) errors.gcasNumber = 'GCAS Registration Number is required';
        if (!formData.profileImage) errors.profileImage = 'Profile photo is required';
        if (!formData.pdf) errors.pdf = 'Marksheet is required';
        if (!selectedDepartment) errors.department = 'Please select a department';
        if (selectedCourses.length === 0) errors.courses = 'Please select one course';
        if (!selectedExamDate) errors.examDate = 'Please select an exam date';
        if (!formData.tID) errors.tID = 'Transaction ID is required';

        setFormErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formPayload = new FormData();
            formPayload.append('tID', formData.tID);
            formPayload.append('name', formData.name);
            formPayload.append('number', formData.number);
            formPayload.append('email', formData.email);
            formPayload.append('gcasNumber', formData.gcasNumber);
            formPayload.append('profileImage', formData.profileImage);
            formPayload.append('pdf', formData.pdf);
            formPayload.append('departmentName', selectedDepartment.name);
            formPayload.append('courseName', selectedCourses[0] || '');
            formPayload.append('examDate', selectedExamDate);

            await DataService.examRegistration(formPayload);

            // Show success state instead of immediately closing
            setIsSubmissionSuccess(true);
            ReactGA.event({ category: 'Admission', action: 'Form Submitted' });

            // Set timeout to close after 5 seconds
            setTimeout(() => {
                closeForm();
                setIsSubmissionSuccess(false); // Reset for next submission
            }, 5000);

        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Display file upload error with better UX
    const renderFileUploadField = (fieldName, label, accept, requirements) => {
        const file = formData[fieldName];
        const error = formErrors[fieldName];

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label} * <span className="text-gray-500 text-xs">{requirements}</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        name={fieldName}
                        accept={accept}
                        onChange={handleInputChange}
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className={`h-14 flex items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 
                        ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-[#1e3f59]'} transition-colors`}>
                        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
                            {file?.name || `Click to upload ${label.toLowerCase()}`}
                        </p>
                    </div>
                </div>
                {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Floating Button - Bottom left on mobile, left top on desktop */}
            <div className="fixed bottom-7 left-4 md:left-6 md:top-6 w-45 md:bottom-auto z-40">
                <div className="relative">
                    <div className={`absolute inset-0 rounded-xl transition-all duration-700 ${isGlowing ? 'bg-blue-400 blur-md opacity-50 scale-110'
                        : 'bg-transparent blur-none opacity-0 scale-100'
                        }`} />
                    <button
                        onClick={openForm}
                        className="relative bg-[#1e3f59] hover:bg-[#1A556F] text-white font-medium py-3 px-6 rounded-xl 
        shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center md:text-base"
                    >
                        <span className="relative z-10 lg:text-lg text-xs ">
                            Entrance Exam Registration
                        </span>
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div ref={overlayRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        ref={popupRef}
                        className="relative bg-white rounded-xl overflow-hidden w-full max-w-2xl shadow-2xl"
                        style={{ maxHeight: '90vh' }}
                    >
                        <button
                            onClick={closeForm}
                            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full 
                            w-7 h-7 flex items-center justify-center z-10 transition-colors"
                        >
                            &times;
                        </button>

                        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {/* Header */}
                            <div ref={headerRef} className="p-6 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-center text-[#1e3f59]">
                                    Entrance Exam Registration
                                </h3>
                            </div>

                            {/* Content */}
                            <div ref={contentRef} className="p-6">
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* Entrance Fee Section */}
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                            <div className="space-y-3">
                                                <p className="font-semibold text-yellow-700 text-sm">ENTRANCE EXAM FEE</p>
                                                <div className="text-gray-700 text-sm space-y-2">
                                                    <p>• Mandatory ₹1,000 entrance fee payment required.</p>
                                                    <p>• This registration is for Department of Animation & School of Design courses only.</p>
                                                    <p>• Payment is non refundable.</p>
                                                    <div className="pt-2">
                                                        <div className="flex flex-col gap-4">
                                                            {/* Payment Methods */}
                                                            <div className="space-y-3">
                                                                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                                    Payment Options
                                                                </h5>

                                                                {/* UPI Payment Card */}
                                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                                                        {/* QR Code */}
                                                                        <div className="shrink-0">
                                                                            <img
                                                                                src="/payment.png"
                                                                                alt="UPI Payment QR Code"
                                                                                className="w-36 h-36 border-2 border-gray-100 rounded-lg p-1.5 bg-white"
                                                                            />
                                                                            <p className="text-center text-xs text-gray-500 mt-1.5">
                                                                                Scan QR Code
                                                                            </p>
                                                                        </div>

                                                                        {/* Vertical Separator */}
                                                                        <div className="hidden md:block w-px h-32 bg-gray-200" />

                                                                        {/* Payment Details */}
                                                                        <div className="space-y-3 flex-1 w-full">
                                                                            <div className="space-y-2">
                                                                                <p className="text-xs font-medium text-gray-700">
                                                                                    UPI Payment Details
                                                                                </p>
                                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                                    <p className="text-xs font-mono text-gray-600 break-all">
                                                                                        cpcgu@indianbk
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <a
                                                                                href="upi://pay?pa=cpcgu@indianbk&pn=CentreforProfessionalCourses&am=1000&cu=INR"
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 
                                        text-sm font-medium text-white bg-[#1e3f59] hover:bg-[#1A556F] rounded-lg 
                                        transition-colors"
                                                                            >
                                                                                Pay via UPI ↗
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Transaction ID Input */}
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Transaction ID *
                                                                </label>
                                                                <input
                                                                    name="tID"
                                                                    type="text"
                                                                    value={formData.tID}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border ${formErrors.tID ? 'border-red-500' : 'border-gray-200'} 
                                                                    focus:ring-2 focus:ring-[#1e3f59] focus:border-transparent`}
                                                                    placeholder="Enter UPI Transaction ID"
                                                                />
                                                                {formErrors.tID && (
                                                                    <p className="text-red-500 text-xs mt-1">{formErrors.tID}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Personal Information */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Enter your full name' },
                                                    { label: 'Email *', name: 'email', type: 'email', placeholder: 'example@domain.com' },
                                                    { label: 'Mobile Number *', name: 'number', type: 'text', placeholder: '9876543210' },
                                                    { label: 'GCAS Registration Number *', name: 'gcasNumber', type: 'text', placeholder: 'GCAS Registration No.' },
                                                ].map((field) => (
                                                    <div key={field.name} className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                                        <input
                                                            name={field.name}
                                                            type={field.type}
                                                            value={formData[field.name]}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border ${(field.name === 'number' && formErrors.mobile) || formErrors[field.name]
                                                                ? 'border-red-500' : 'border-gray-200'
                                                                } focus:ring-2 focus:ring-[#1e3f59] focus:border-transparent`}
                                                            placeholder={field.placeholder}
                                                        />
                                                        {field.name === 'number' && formErrors.mobile ? (
                                                            <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                                                        ) : formErrors[field.name] && (
                                                            <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Document Uploads */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Document Uploads</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {renderFileUploadField('pdf', '12th/Final Year Marksheet', 'application/pdf', '(PDF, max 1MB)')}
                                                {renderFileUploadField('profileImage', 'Profile Photo', 'image/*', '(JPG/PNG, max 1MB)')}
                                            </div>
                                        </div>

                                        {/* Department Selection */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Department & Course Selection</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">Select Department *</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {staticDepartments.map((department) => (
                                                            <button
                                                                key={department.name}
                                                                type="button"
                                                                onClick={() => handleDepartmentSelect(department)}
                                                                className={`p-4 text-left rounded-lg border transition-all ${selectedDepartment?.name === department.name
                                                                    ? 'border-[#1e3f59] bg-[#1e3f59]/10 ring-1 ring-[#1e3f59]'
                                                                    : 'border-gray-200 hover:border-[#1e3f59]/40'
                                                                    }`}
                                                            >
                                                                <h4 className="text-sm font-medium text-gray-800">{department.name}</h4>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {formErrors.department && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>
                                                    )}
                                                </div>

                                                {/* Course Selection */}
                                                {selectedDepartment && (
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Select Course *</label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {selectedDepartment.courses.map((course) => (
                                                                <button
                                                                    key={course}
                                                                    type="button"
                                                                    onClick={() => handleCourseSelect(course)}
                                                                    className={`p-3 text-left rounded-lg border transition-all ${selectedCourses.includes(course)
                                                                        ? 'border-[#1e3f59] bg-[#1e3f59]/10 ring-1 ring-[#1e3f59]'
                                                                        : 'border-gray-200 hover:border-[#1e3f59]/40'
                                                                        } ${selectedCourses.length >= 1 && !selectedCourses.includes(course)
                                                                            ? ''
                                                                            : ''
                                                                        }`}
                                                                >
                                                                    <span className="text-sm text-gray-800">{course}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {formErrors.courses && (
                                                            <p className="text-red-500 text-xs mt-1">{formErrors.courses}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Exam Date Selection */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Exam Date Selection</h4>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Select Exam Date *</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {examDates.map((examDate) => (
                                                        <button
                                                            key={examDate.id}
                                                            type="button"
                                                            onClick={() => handleExamDateSelect(examDate.value)}
                                                            className={`p-4 text-left rounded-lg border transition-all ${selectedExamDate === examDate.value
                                                                ? 'border-[#1e3f59] bg-[#1e3f59]/10 ring-1 ring-[#1e3f59]'
                                                                : 'border-gray-200 hover:border-[#1e3f59]/40'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-800">{examDate.date}</span>
                                                                {selectedExamDate === examDate.value && (
                                                                    <svg className="w-5 h-5 text-[#1e3f59]" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {formErrors.examDate && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.examDate}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Important Notes */}
                                        <div className="bg-blue-50 border-l-4 border-[#1e3f59] p-4 rounded-lg space-y-2">
                                            <p className="text-sm font-semibold text-[#1e3f59]">IMPORTANT NOTES</p>
                                            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                                                <li>
                                                    <span>Last Date for Online Registration (DEE):</span>
                                                    <span className="font-semibold">To be announced.</span>
                                                </li>
                                                {/* <li>
                                                    <span>Date of Design Entrance Examination (DEE):</span>
                                                    <span className="font-semibold">To be announced</span>
                                                </li> */}
                                                <li>All information submitted is final and cannot be modified.</li>
                                                <li>Ensure documents are clear and valid.</li>
                                                <li>Updates will be sent to your registered email.</li>
                                                <li>Invalid, Incomplete, Wrongful submissions will be rejected.</li>
                                                <li>File uploads must be less than 1MB in size.</li>

                                            </ul>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div ref={footerRef} className="p-6 border-t border-gray-200">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeForm}
                                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-sm font-medium text-white bg-[#1e3f59] hover:bg-[#1A556F] 
                                        rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isSubmissionSuccess && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg max-w-md text-center">
                                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="mt-3 text-lg font-medium text-gray-900">Application Submitted!</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Your entrance exam registration was successful. You'll receive a confirmation email shortly.
                                </p>
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeForm();
                                            setIsSubmissionSuccess(false);
                                        }}
                                        className="px-4 py-2 bg-[#1e3f59] text-white rounded-md hover:bg-[#1A556F] focus:outline-none"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AdmissionRegistrationFloatingButton;