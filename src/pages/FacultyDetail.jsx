import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../componets/Header';
import { FaAward, FaBook, FaChalkboardTeacher, FaGraduationCap, FaLightbulb, FaNewspaper } from 'react-icons/fa';
import Footer from '../componets/Footer';
import DataService from "../api/dataService";
import ScrollToTop from '../componets/ScrollToTop';
import '../assets/css/Spinner.css';

function FacultyDetail() {
    const { id } = useParams();
    const [facultyMember, setFacultyMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);


    useEffect(() => {
        async function fetchFacultyData() {
            try {
                const response = await DataService.getFacultyData(id);
                setFacultyMember(response.data);
            } catch (err) {
                setError('Failed to load faculty data.');
            } finally {
                setLoading(false);
            }
        }

        fetchFacultyData();
    }, [id]);

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
                    <p className="mt-4">Loading member...</p>
                </div>
            </div>
        </div>);
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>;
    }

    return (
        <>
            <Header transparent={false} />
            <div className="min-h-screen m-10">
                {/* Faculty Header with Image */}
                <div className="max-w-4xl mx-auto rounded-xl shadow-lg border border-gray-300 bg-white overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Faculty Image */}
                        <div className="md:w-1/3 relative">
                            {imageLoading && (
                                <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A556F]"></div>
                                </div>
                            )}
                            <img
                                src={facultyMember.profileImageUrl}
                                alt={facultyMember.name}
                                className={`w-full h-96 md:h-full object-cover transform transition-transform duration-300 ${imageLoading ? "opacity-0" : "opacity-100"
                                    }`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => setImageLoading(false)}
                            />
                        </div>
                        {/* Faculty Name and Designation */}
                        <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{facultyMember.name}</h1>
                            <p className="text-sm md:text-base text-gray-700">{facultyMember.position}</p>
                        </div>
                    </div>
                </div>

                {/* Qualifications */}
                <div className="max-w-4xl mx-auto mt-8 border border-gray-300 bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center mb-6">
                        <FaGraduationCap className="text-4xl text-purple-600 mr-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Qualifications</h2>
                    </div>
                    <p className="text-gray-700">{facultyMember.qualifications}</p>
                </div>

                {/* Areas of Interest */}
                <div className="max-w-4xl mx-auto mt-8 border border-gray-300 bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center mb-6">
                        <FaLightbulb className="text-4xl text-purple-600 mr-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Areas of Interest</h2>
                    </div>
                    <p className="text-gray-700">{facultyMember.areasOfInterest}</p>
                </div>

                {/* Brief Profile */}
                <div className="max-w-4xl mx-auto mt-8 border border-gray-300 bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center mb-6">
                        <FaChalkboardTeacher className="text-4xl text-purple-600 mr-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Brief Profile</h2>
                    </div>
                    <div
                        className="text-gray-700 break-words"
                        dangerouslySetInnerHTML={{ __html: facultyMember.briefProfile.replace(/\n/g, "<br/><br/>") }}>
                    </div>
                </div>

                {/* Achievements */}
                {facultyMember.achievements && (
                    <div className="max-w-4xl border border-gray-300 mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <FaAward className="text-4xl text-purple-600 mr-4" />
                            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                        </div>
                        <div
                            className="text-gray-700 break-words"
                            dangerouslySetInnerHTML={{ __html: facultyMember.achievements.replace(/\n/g, "<br/><br/>") }}>
                        </div>
                    </div>
                )}

                {/* Publications */}
                {facultyMember.publications && (
                    <div className="max-w-4xl border border-gray-300 mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <FaNewspaper className="text-4xl text-purple-600 mr-4" />
                            <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
                        </div>
                        <div
                            className="text-gray-700 break-words"
                            dangerouslySetInnerHTML={{ __html: facultyMember.publications.replace(/\n/g, "<br/><br/>") }}>
                        </div>
                    </div>
                )}
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

export default FacultyDetail;