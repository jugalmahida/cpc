import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import ScrollToTop from '../componets/ScrollToTop';
import DataService from "../api/dataService";
import ReactGA from 'react-ga4'; // Import ReactGA

export default function StudentActivities() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);  // State to store the clicked image index
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await DataService.getAllEvents();
                if (response.status === "success") {
                    setEvents(response.data);
                    // console.log(response.data[0].images);

                    if (response.data.length > 0) {
                        setSelectedEvent(response.data[0]);
                        const firstImage = response.data[0].images[Object.keys(response.data[0].images)[0]][0].imageUrl;
                        preloadImage(firstImage);
                        setCurrentImage(firstImage);
                    }
                } else {
                    setError("Failed to fetch events.");
                    console.error("API Error:", response);
                }
            } catch (err) {
                setError("An error occurred while fetching events.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const preloadImage = (imageUrl) => {
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.src = imageUrl;
    };

    const openModal = (image, index) => {
        ReactGA.event({
            category: 'Student Activities',
            action: 'Open Image Modal',
            label: `Image: ${image}`
        });
        setCurrentImage(image);
        setSelectedImageIndex(index);
        setShowModal(true);
        setImageLoaded(false);
        preloadImage(image);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (showModal) {
                if (event.key === "Escape") {
                    closeModal();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showModal]);

    if (loading) {
        return (
            <div className="p-4">
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
            </div>
        )
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (events.length === 0) {
        return <div className="text-center py-8">No events found.</div>;
    }

    return (
        <div>
            <div className="p-4 bg-gray-50 min-h-screen">
                <Header transparent={false} />

                <div className="flex flex-wrap items-center justify-center gap-4 py-4 md:py-8">
                    {events.map((event) => (
                        <button
                            key={event._id}
                            type="button"
                            className={`px-4 py-2 text-sm md:text-base md:px-6 md:py-2 rounded-full font-medium transition-all duration-300 ${selectedEvent?._id === event._id
                                ? "bg-[#1A556F] text-white"
                                : "bg-white text-gray-900 border border-gray-300 hover:bg-[#1A556F] hover:text-white"
                                }`}
                            onClick={() => {
                                ReactGA.event({
                                    category: 'Student Activities',
                                    action: 'Select Event',
                                    label: `Event: ${event.name}`
                                });
                                setSelectedEvent(event);
                                setCurrentImage(event.images[Object.keys(event.images)[0]][0].imageUrl);
                            }}
                        >
                            {event.name}
                        </button>
                    ))}
                </div>

                {selectedEvent && (
                    <motion.div
                        key={selectedEvent._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {Object.keys(selectedEvent.images)
                            .sort((a, b) => b.localeCompare(a)) // Sort in descending order
                            .map(monthYear => {
                                const [year, month] = monthYear.split('-');
                                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                const monthIndex = parseInt(month) - 1;
                                const monthName = monthNames[monthIndex];
                                return (
                                    <div key={monthYear}>
                                        <h2 className="text-2xl font-semibold ml-5 mt-2 mb-2">{monthName} {year}</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
                                            {selectedEvent.images[monthYear].map((image, index) => (
                                                <motion.div
                                                    key={image._id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative p-[2px]"
                                                >
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
                                                        </div>
                                                        <img
                                                            crossorigin="anonymous"
                                                            className="w-full rounded-lg h-64 object-cover cursor-pointer transform hover:scale-105 transition-transform duration-300 opacity-0"
                                                            src={image.imageUrl}
                                                            alt={selectedEvent.name}
                                                            onClick={() => openModal(image.imageUrl, index)}
                                                            onLoad={(event) => event.target.classList.remove("opacity-0")}
                                                            onError={(event) => event.target.classList.remove("opacity-0")}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </motion.div>
                )}

                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-auto"
                        >
                            <div className="relative rounded-lg max-w-4xl w-full p-6">
                                <button
                                    className="absolute top-1 right-1 text-white text-4xl font-bold transition-colors duration-200"
                                    onClick={closeModal}
                                >
                                    &times;
                                </button>
                                <div className="max-h-[80vh] overflow-auto relative">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        navigation
                                        initialSlide={selectedImageIndex}
                                        ref={swiperRef}
                                    >
                                        {selectedEvent && Object.keys(selectedEvent.images).flatMap(month =>
                                            selectedEvent.images[month].map(image => (
                                                <SwiperSlide key={image._id}>
                                                    <img
                                                        className="w-full h-auto max-w-full max-h-[70vh] object-contain rounded-lg"
                                                        src={image.imageUrl}
                                                        alt="Full View"
                                                    />
                                                </SwiperSlide>
                                            ))
                                        )}
                                    </Swiper>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
            <br />
            <br />
            <br />
            <br />

            <ScrollToTop />
        </div>
    );
}
