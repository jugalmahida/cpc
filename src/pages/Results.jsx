import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataService from "../api/dataService";
import Footer from '../componets/Footer';
import Header from '../componets/Header';

export default function Results() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const apiResponse = await DataService.getResults();

                if (apiResponse.status === 'success') {
                    setResults(apiResponse.data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching results:', error);
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleResultClick = (result) => {
        if (result.url) {
            window.open(result.url, '_blank', 'noopener,noreferrer');
        }
    };

    // Animation variants for container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1 // Stagger the animation of child elements
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7
            }
        }
    };

    if (isLoading) {
        return (
            <div className="p-4">
                
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-t-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                        <p className="mt-4">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">CPC Results</h1>
                <Header />
                {results.length === 0 ? (
                    <div className="text-center text-gray-500">No results found</div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {results.map((result) => (
                            <motion.div
                                key={result._id}
                                className="group p-4 sm:p-5 bg-white rounded-2xl shadow-lg border-l-4 border-[#1A556F] hover:border-[#2C3E50] hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => handleResultClick(result)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                variants={cardVariants}
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                                    {result.name}
                                </h3>
                                <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 px-3 py-1 sm:px-4 sm:py-2 text-white bg-[#1A556F] hover:bg-[#2C3E50] rounded-lg text-xs sm:text-sm transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent div click
                                    }}
                                >
                                    View Details
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                
            </div>
            <Footer />
            <br />
            <br />
            <br />
            <br />
        </>
    );
}