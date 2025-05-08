import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import ScrollToTop from '../componets/ScrollToTop';
import DataService from "../api/dataService";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReactGA from 'react-ga4'; // Import ReactGA

export default function MediaCoverage() {
    const [media, setMedia] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const response = await DataService.getMediaImage();
                if (response.status === "success") {
                    setMedia(response.data);
                    if (response.data.length > 0) {
                        const firstImage = response.data[0].imageUrl;
                        preloadImage(firstImage);
                        setCurrentImage(firstImage);
                    }
                } else {
                    setError("Failed to fetch media.");
                    console.error("API Error:", response);
                }
            } catch (err) {
                setError("An error occurred while fetching media.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const preloadImage = (imageUrl) => {
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.src = imageUrl;
    };

    const openModal = (image) => {
        ReactGA.event({
            category: 'Media Coverage',
            action: 'Open Image Modal',
            label: `Image: ${image}`
        });
        setCurrentImage(image);
        setShowModal(true);
        setImageLoaded(false);
        preloadImage(image);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const navigateImage = (direction) => {
        if (!media || media.length === 0) return;

        const currentIndex = media.findIndex(img => img.imageUrl === currentImage);
        let nextImage;

        if (direction === "prev") {
            nextImage = media[(currentIndex - 1 + media.length) % media.length];
        } else {
            nextImage = media[(currentIndex + 1) % media.length];
        }

        setImageLoaded(false);
        preloadImage(nextImage.imageUrl);
        setCurrentImage(nextImage.imageUrl);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (showModal) {
                if (event.key === "ArrowLeft") {
                    navigateImage("prev");
                } else if (event.key === "ArrowRight") {
                    navigateImage("next");
                } else if (event.key === "Escape") {
                    closeModal();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showModal, currentImage, media]);

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

    if (media.length === 0) {
        return <div className="text-center py-8">No media found.</div>;
    }

    return (
        <>
            <div className="p-4 bg-gray-50 min-h-screen">
                <Header transparent={false} />
                <div className="text-xl text-center font-semibold py-4">
                    Media Coverage
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={media.length}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {media.map((item, index) => (
                            <motion.div
                                key={item._id}
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
                                        className="w-full h-48 object-cover cursor-pointer transform hover:scale-105 transition-transform duration-300 opacity-0"
                                        src={item.imageUrl}
                                        alt="Media Coverage"
                                        onClick={() => openModal(item.imageUrl)}
                                        onLoad={(event) => event.target.classList.remove("opacity-0")}
                                        onError={(event) => event.target.classList.remove("opacity-0")}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

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
                                    className="absolute top-3 right-1 text-white text-4xl font-bold transition-colors duration-200"
                                    onClick={closeModal}
                                >
                                    &times;
                                </button>
                                <div className="max-h-[80vh] overflow-auto relative">
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1A556F]"></div>
                                        </div>
                                    )}
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation
                                        initialSlide={media.findIndex((img) => img.imageUrl === currentImage)}
                                    >
                                        {media.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    className={`w-full h-auto max-w-full max-h-[70vh] object-contain rounded-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                                    src={item.imageUrl}
                                                    alt={`Media Coverage ${index}`}
                                                    onLoad={() => setImageLoaded(true)}
                                                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                                                />
                                            </SwiperSlide>
                                        ))}
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
        </>
    );
}
