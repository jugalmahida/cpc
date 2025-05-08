import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../componets/Header";
import ScrollToTop from '../componets/ScrollToTop';
import Footer from "../componets/Footer";
import DataService from "../api/dataService"; // Import your DataService
import ReactGA from 'react-ga4'; // Import ReactGA

const getMonthYear = (dateString) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const [year, month] = dateString.split("-");
    return `${months[parseInt(month, 10) - 1]} ${year}`;
};

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await DataService.getAnnouncements(); // Use your DataService function
                if (response.status === "success") {
                    setAnnouncements(response.data);
                } else {
                    setError("Failed to fetch announcements.");
                    console.error("API Error:", response);
                }
            } catch (err) {
                setError("An error occurred while fetching announcements.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const groupedAnnouncements = announcements.reduce((acc, announcement) => {
        const monthYear = getMonthYear(announcement.date);
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(announcement);
        return acc;
    }, {});

    const handleAnnouncementClick = (announcement) => {
        ReactGA.event({
            category: 'Announcements',
            action: 'Open Announcement',
            label: announcement.title
        });
        if (announcement.file_attachments) {
            window.open(announcement.file_attachments, "_blank");
        } else {
            // Optionally, you can display a message or do nothing
            console.log("No attachment for this announcement.");
        }
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
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (announcements.length === 0) {
        return <div className="text-center py-8">No announcements found.</div>;
    }

    return (
        <div style={{ marginBottom: -150 }}>
            <div className="max-w-5xl mx-auto p-6">
                <Header />
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    CPC Announcements
                </h1>

                {Object.entries(groupedAnnouncements).map(([monthYear, announcements]) => (
                    <div key={monthYear} className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">📅 {monthYear}</h2>
                        <div className="grid md:grid-cols-2 gap-4 grid-auto-rows-min">
                            {announcements.map((announcement, index) => (
                                <motion.div
                                    key={announcement._id}
                                    className={`p-5 bg-white rounded-2xl shadow-lg border-l-4 border-[#1A556F] hover:shadow-xl transition-all ${announcement.file_attachments ? 'cursor-pointer' : 'cursor-default'}`}
                                    onClick={() => handleAnnouncementClick(announcement)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        🕒 {announcement.date}
                                    </p>
                                    <p className="text-gray-700 mt-2 line-clamp-3">
                                        {announcement.description}
                                    </p>
                                    {announcement.file_attachments && (
                                        <a
                                            href={announcement.file_attachments}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 px-4 py-2 text-white bg-[#1A556F] hover:bg-[#2C3E50] rounded-lg text-sm transition-all"
                                        >
                                            View Attachment
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
                <ScrollToTop />
            </div>
            <Footer /> 
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}