import React, { useState, useEffect, use } from "react";
import conferenceImage from '/images/faculties_group.jpg';
import FacultyCard from "../componets/FacultyCard";
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import ScrollToTop from '../componets/ScrollToTop';
import DataService from "../api/dataService";
import ReactGA from 'react-ga4'; // Import ReactGA
import { useLocation } from 'react-router-dom';

const getAllVerticalPromise = DataService.getVerticals();

export default function Faculty() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(null);
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const verticalResponse = use(getAllVerticalPromise);
    const verticals = verticalResponse.data;

    useEffect(() => {
        // Check if we have a stored tab in sessionStorage
        const storedActiveTab = sessionStorage.getItem('activeTab');

        if (storedActiveTab && verticals && verticals.some(v => v._id === storedActiveTab)) {
            // If we have a stored tab and it exists in our verticals, use it
            setActiveTab(storedActiveTab);
        } else if (verticals && verticals.length > 0 && !activeTab) {
            // Otherwise, default to the first tab
            setActiveTab(verticals[0]._id);
        }
    }, [verticals]);

    // Save the active tab to sessionStorage whenever it changes
    useEffect(() => {
        if (activeTab) {
            sessionStorage.setItem('activeTab', activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        const loadFacultyMembers = async () => {
            if (activeTab) {
                setIsLoading(true);
                try {
                    const faculty = await DataService.getFacultyByVertical(activeTab);
                    const facultyData = faculty.data || [];

                    // Sort faculty members to place Dr. Rajesh Khatri first
                    const sortedFaculty = sortFacultyWithPriority(facultyData, "Dr. Rajesh Khatri");

                    setFacultyMembers(sortedFaculty);
                } catch (error) {
                    console.error("Error loading faculty:", error);
                    setFacultyMembers([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadFacultyMembers();
    }, [activeTab]);

    // Function to prioritize specific faculty member
    const sortFacultyWithPriority = (facultyList, priorityName) => {
        if (!facultyList || facultyList.length === 0) return [];

        // Find the index of Dr. Rajesh Khatri
        const priorityIndex = facultyList.findIndex(faculty =>
            faculty.name === priorityName ||
            faculty.name.includes(priorityName)
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

    const handleDirectorClick = () => {
        ReactGA.event({
            category: 'Faculty',
            action: 'Click Director Card',
            label: 'Dr. Paavan Pandit'
        });
        window.open("https://sites.google.com/view/paavanpandit/home", "_blank");
    };

    const handleAjoyDasClick = () => {
        ReactGA.event({
            category: 'Faculty',
            action: 'Click Faculty Card',
            label: 'Dr. Ajoy Das'
        });
        window.open("https://www.gujaratuniversity.ac.in/Faculty/profile?userid=233", "_blank");
    };

    return (
        <div className="">
            <Header transparent={false} />
            {/* Main Image */}
            <section
                className="bg-center bg-cover bg-no-repeat w-full relative"
                style={{
                    backgroundImage: `url(${conferenceImage})`,
                    height: "100vh", // Use viewport height instead of min-height
                    minHeight: "300px", // Set a minimum height
                    maxHeight: "650px", // Set a maximum height
                    backgroundPosition: "center 30%" // Adjust vertical position slightly from center
                }}
            >
                <div className="px-4 mx-auto max-w-screen-xl text-center py-8 md:py-16 lg:py-24 h-full flex items-center justify-center">
                    {/* If you have any content in this section, place it here */}
                </div>
            </section>

            <p className="pt-1 font-bold text-2xl text-center h-10 mb-1">
                CPC Faculties Member & Staff
            </p>

            <div className="p-5">
                <div className="flex flex-wrap justify-center">
                    {/* Director Card */}
                    <div
                        onClick={handleDirectorClick}
                        className="p-3 m-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 cursor-pointer w-full md:w-auto"
                    >
                        <img
                            className="w-full md:w-60 object-cover rounded-lg"
                            src="/images/sir.jpg"
                            alt=""
                            loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h2 className="text-2xl font-bold mb-2">Dr. Paavan Pandit</h2>
                            <p className="mb-3 font-normal text-gray-700">
                                <span className="font-semibold block mb-1">Director</span>
                                <span className="block">Centre for professional courses</span>
                                <span className="block mt-1 ">View More</span>
                            </p>
                        </div>
                    </div>

                    {/* Dr. Ajoy Das Card (Currently commented out) */}
                    {/* <div
                        onClick={handleAjoyDasClick}
                        className="p-3 m-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 cursor-pointer w-full md:w-auto"
                    >
                        <img
                            className="w-full md:w-60 object-cover rounded-lg"
                            src="/images/ajoy_das_resize.JPG"
                            alt=""
                            loading="lazy"
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h2 className="text-2xl font-bold mb-2">Dr. Ajoy Das</h2>
                            <p className="mb-3 font-normal text-gray-700">
                                <span className="font-semibold block mb-1">Cartographer</span>
                                <span className="block">Centre for professional courses</span>
                                <span className="block mt-1 ">View More</span>
                            </p>
                        </div>
                    </div> */}
                </div>

                {/* Vertical Tabs */}
                <ul className="mt-3 flex flex-wrap text-sm font-medium text-center text-gray-500">
                    {verticals && verticals.map((vertical) => (
                        <li key={vertical._id} className="me-2 p-1">
                            <button
                                className={`inline-block px-4 py-3 rounded-lg ${activeTab === vertical._id
                                    ? 'text-white bg-[#1A556F]'
                                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab(vertical._id)}
                            >
                                {vertical.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Faculty Grid */}
                <div className="mt-4">
                    {isLoading ? (
                        <div className="text-center py-4">Loading faculty members...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {facultyMembers.map((faculty, index) => (
                                <FacultyCard key={index} facultyMember={faculty} />
                            ))}
                        </div>
                    )}
                </div>
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