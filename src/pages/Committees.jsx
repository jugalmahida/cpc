import React, { useState, useEffect,useRef } from "react";
import Header from "../componets/Header";
import Footer from "../componets/Footer";
import ScrollToTop from '../componets/ScrollToTop';
import DataService from "../api/dataService";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function Committees() {
    const [committees, setCommittees] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState({}); // Track image loading for each faculty
    const committeesRef = useRef([]);
    const memberRefs = useRef([]);


    useEffect(() => {
        const fetchCommittees = async () => {
            try {
                const response = await DataService.getAllCommittees();
                if (response.status === "success") {
                    setCommittees(response.data);
                } else {
                    setError("Failed to fetch committees.");
                }
            } catch (err) {
                setError("An error occurred while fetching committees.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommittees();
    }, []);

    useEffect(() => {
        if (committees) { // Only run if committees data is available
            committeesRef.current.forEach((committee, index) => {
                ScrollTrigger.create({
                    trigger: committee,
                    start: "top 80%",
                    onEnter: () => {
                        gsap.fromTo(
                            committee,
                            { opacity: 0, y: 50 },
                            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
                        );
                    },
                    once: true,
                });
            });
        }
    }, [committees]); // Depend on committees

    useEffect(() => {
        if (committees) { // Only run if committees data is available
            memberRefs.current.forEach((members, index) => {
                ScrollTrigger.create({
                    trigger: committeesRef.current[index],
                    start: "top 80%",
                    onEnter: () => {
                        gsap.fromTo(
                            members,
                            { opacity: 0, y: 50 },
                            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
                        );
                    },
                    once: true,
                });
            });
        }
    }, [committees]); //

    const handleImageLoad = (facultyId) => {
        setImageLoading(prev => ({ ...prev, [facultyId]: false }));
    };

    const handleImageError = (facultyId) => {
        setImageLoading(prev => ({ ...prev, [facultyId]: false }));
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
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    if (committees === null) {
        return <div className="text-center py-8">No committees found.</div>;
    }
    
    return (
        <div>
            <div className="bg-gray-100 min-h-screen px-4 sm:px-6 py-8">
                <Header />

                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
                    CPC Committees
                </h1>

                <div className="space-y-8">
                    {committees.map((committee, committeeIndex) => (
                        <div
                            key={committee._id}
                            ref={(el) => (committeesRef.current[committeeIndex] = el)}
                            className="mb-10 sm:mb-12 p-4 sm:p-6 bg-white rounded-lg shadow-lg"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b-2 pb-2">{committee.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {committee.faculties.map((member, memberIndex) => {
                                    const facultyId = member._id;
                                    if (imageLoading[facultyId] === undefined) {
                                        setImageLoading(prev => ({ ...prev, [facultyId]: true }));
                                    }
                                    return (
                                        <div
                                            key={facultyId}
                                            ref={(el) => {
                                                if (!memberRefs.current[committeeIndex]) {
                                                    memberRefs.current[committeeIndex] = [];
                                                }
                                                memberRefs.current[committeeIndex][memberIndex] = el;
                                            }}
                                            className="relative flex flex-col items-center bg-gray-50 border border-gray-500 rounded-lg shadow-md hover:bg-gray-200 p-4 sm:p-6 text-center"
                                        >
                                            <div className="relative w-20 sm:w-28 h-20 sm:h-28 mb-4"> {/* Image wrapper with fixed dimensions */}
                                                {imageLoading[facultyId] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                                                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1A556F]"></div>
                                                    </div>
                                                )}
                                                <img
                                                    className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                                                    src={member.profileImageUrl}
                                                    alt={member.name}
                                                    onLoad={() => handleImageLoad(facultyId)}
                                                    onError={() => handleImageError(facultyId)}
                                                    style={{ display: imageLoading[facultyId] ? 'none' : 'block' }}
                                                />
                                            </div>
                                            <h5 className="text-sm sm:text-lg font-semibold text-gray-700">{member.name}</h5>
                                            
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <ScrollToTop />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}