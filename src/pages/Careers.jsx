import React, { useState, useEffect } from "react";
import Header from "../componets/Header";
import ScrollToTop from '../componets/ScrollToTop';
import Footer from "../componets/Footer";
import DataService from "../api/dataService"; // Import your DataService
import ReactGA from 'react-ga4'; // Import ReactGA

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await DataService.getAllJobs(); // DataService function
                if (response.status === "success") {
                    setJobs(response.data);
                } else {
                    setError("Failed to fetch jobs.");
                    console.error("API Error:", response);
                }
            } catch (err) {
                setError("An error occurred while fetching jobs.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleAttachmentClick = (job) => {
        ReactGA.event({
            category: 'Careers',
            action: 'Download Job Attachment',
            label: job.title
        });
    };

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

    return (
        <div>
            <div className="container mx-auto p-6">
                <Header />

                <h1 className="text-4xl font-bold text-center mb-6">Careers at CPC, Gujarat University</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 ">Current Job Openings</h2>
                    {jobs.length === 0 ? (
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-gray-700">
                            <p className="text-lg">No current openings.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobs.map((job) => (
                                <div key={job._id} className="bg-white border-l-4 border-[#1A556F] p-6 rounded-lg shadow-md hover:shadow-xl transition-all relative">
                                    
                                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                    <p className="text-gray-700 mb-2">{job.location}</p>
                                    <p className="text-gray-700 mb-4">{job.description}</p>
                                    {job.file_attachments && (
                                        <a
                                            href={job.file_attachments}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 px-4 py-2 text-white bg-[#1A556F] hover:bg-[#2C3E50] rounded-lg text-sm transition-all"
                                            onClick={() => handleAttachmentClick(job)}
                                        >
                                            View Attachment
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">Interested candidates can send their resumes to <a href="mailto:recruitment.cpc@gujaratuniversity.ac.in"><span className="text-blue-700">recruitment.cpc@gujaratuniversity.ac.in</span></a> with the subject line <strong> "Job Application - [Position Name]"</strong>.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 ">Why Join Us?</h2>
                    <ul className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed ">
                        <li><strong>Prestigious Reputation</strong></li>
                        <p className="text-gray-700">Gujarat University is a leading institution in India, known for its exceptional academic standards and innovative research.</p> <br />
                        <li><strong>Cutting-Edge Infrastructure</strong></li>
                        <p className="text-gray-700">CPC is well equipped with advanced labs, smart classrooms and extensive libraries for outstanding academic and professional growth.</p> <br />
                        <li><strong>Collaborative Research Opportunities</strong></li>
                        <p className="text-gray-700">Faculty members have access to frontline research facilities and opportunities for collaboration with industry professionals as well as academic peers.</p> <br />
                        <li><strong>Access to Industry Collaborations</strong></li>
                        <p className="text-gray-700">Leverage Gujarat University's strong ties with the Animation and IT industries to enhance your teaching methods, provide real-world experiences and build a robust professional network.</p>
                    </ul>
                </section>
            </div>

            <Footer />
            <ScrollToTop />

            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Careers;