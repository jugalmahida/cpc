import { useEffect, useRef } from "react";

import Header from '../componets/Header';
import abtImg from '/images/aboutcpc.jpg';
import Footer from '../componets/Footer';
import ScrollToTop from '../componets/ScrollToTop'
import AboutAnimation from '../assets/animations/AboutAnimation'; // Import the animation component
import ReactGA from 'react-ga4'; // Import ReactGA

import { FaBullseye, FaLightbulb, FaRocket, FaHandsHelping, FaHeart, FaUsers } from 'react-icons/fa'; // Import icons from React Icons
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const aboutSectionRef = useRef(null);
    const directorMessageRef = useRef(null);
    const purposeRef = useRef(null);
    const visionRef = useRef(null);
    const missionRef = useRef(null);

    const coreValuesRef = useRef(null);
    const coreValuesCardsRefs = useRef([]); // Ref for all core value cards
    const socialRef = useRef(null);
    const paragraphSectionRef = useRef(null);
    const imageRef = useRef(null);

    const directorImageRef = useRef(null);
    const directorParagraphsRef = useRef(null);
    const directorNameRef = useRef(null);

    const handleInstagramClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click Instagram Link',
            label: 'About Page'
        });
        window.open('https://www.instagram.com/cpc_gujuni/', '_blank');
    };

    const handleLinkedInClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click LinkedIN Link',
            label: 'About Page'
        });
        window.open('https://linkedin.com/in/centre-for-professional-courses-gujarat-university-4a14a835a', '_blank');
    };

    const handleYoutubeClick = () => {
        ReactGA.event({
            category: 'Social',
            action: 'Click Youtube Link',
            label: 'About Page'
        });
        window.open('https://www.youtube.com/@CentreforProfessionalCoursesGU', '_blank');
    };

    return (
        <>
            {/* Include the Header component */}
            <Header />

            {/* Main Image */}
            <div className="relative mx-auto" ref={aboutSectionRef}>
                <section
                    className="bg-no-repeat bg-cover bg-center bg-blend-multiply"
                    style={{ backgroundImage: `url(${abtImg})`, height: '80vh', minHeight: '300px' }}
                >
                    <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56"></div>
                </section>
                <p className="font-bold text-2xl text-center center mt-2">About CPC</p>
            </div>

            {/* About Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div ref={paragraphSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
                            Centre for Professional Courses (CPC) is one of Gujarat University's youngest departments, established in the year 2023. However, it is at par with excellence and an establishment that fosters and caters to the needs of a dynamic world of education. It is situated within the picturesque Gujarat University precinct, which boasts a lush green campus and fascinating building structures.
                        </p>
                        <br />
                        <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
                            Centre for Professional Courses (CPC) stands out for its uniquely blended dynamic academic programs. These programs are designed to prepare students for the ever-changing global challenges. CPC offers multidisciplinary programmes for undergraduates and postgraduates in contemporary professions, such as Animation, Cyber Security, Software development, Cloud technology, Mobile Applications, Fintech, Aviation, and Financial Services, leading to B.SC, M.Sc., MBA degrees, and etc.
                        </p>
                    </div>

                    <div ref={imageRef} className='shadow-xl'>
                        <img
                            className="w-full rounded-lg shadow-xl"
                            src="/images/newimg.jpg"
                            alt="MaaSaraswatiImage"
                        />
                    </div>
                </div>

                {/* Director's message */}
                <div className="mt-12" ref={directorMessageRef}>
                    <div className="p-3 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100">
                        <img ref={directorImageRef} className="h-70 w-full md:w-60 object-cover rounded-lg" src="/images/sir.jpg" alt="" />
                        <div ref={directorParagraphsRef} className="flex flex-col justify-between p-4 leading-normal">
                            <h2 className="text-2xl mb-2 font-bold">Director Message</h2>

                            <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700"> "In today's fast-paced world, new-age skills are in high demand. Our Centre for Professional Courses offers cutting-edge programs to meet these needs. We provide a variety of Master, Integrated Master, and Bachelor Programmes across the School of Design, Department of Aviation, Hospitality & Travel Management, Department of Mobile Application & Technologies, Department of IT-IMS, and Department of Animation. These programs are designed to equip students with the essential knowledge and skills to excel in their fields.
                                <div className='mt-2'>
                                    Our vision is to create an innovative and excellent learning environment. We continuously update our curriculum to align with the latest industry trends and technological advancements. With dedicated faculty and state-of-the-art facilities, we ensure a comprehensive education that prepares students for future challenges.
                                    Join us on this exciting journey as we prepare the next generation of professionals to thrive and lead in a dynamic global environment."
                                </div>
                            </p>
                            <span ref={directorNameRef} className='text-right font-bold'>~ Dr. Paavan Pandit</span>
                        </div>
                    </div>
                </div>

                {/* Our Purpose Section */}
                <div ref={purposeRef} className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">Our Purpose</h3>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Vision Card */}
                        <div ref={visionRef} className="bg-gradient-to-r bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-200 sm:col-span-2">
                            <div className="flex items-center mb-4">
                                <FaLightbulb className="text-4xl text-blue-600 mr-4" />{" "}
                                {/* Icon */}
                                <h4 className="text-xl font-bold text-blue-800">Vision</h4>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
                                To be a globally recognized institution, leading innovation and
                                excellence while equipping society with essential 21st-century
                                skills for transformative impact.
                            </p>
                        </div>

                        {/* Mission Card */}
                        <div ref={missionRef} className="bg-gradient-to-r bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-200 sm:col-span-2">
                            <div className="flex items-center mb-4">
                                <FaBullseye className="text-4xl text-purple-600 mr-4" />{" "}
                                {/* Icon */}
                                <h4 className="text-xl font-bold text-purple-800">Mission</h4>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg text-justify leading-relaxed text-gray-700">
                                Offering progressive new-era academic programs that equip
                                students with next-generation skills, empowering them to lead,
                                innovate and make impactful contribution to the society.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Values Section */}
                <div ref={coreValuesRef} className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">Core Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Origination",
                                description: "We believe in fostering innovation and creativity at every level, encouraging the development of original ideas and groundbreaking solutions.",
                                icon: <FaRocket className="text-4xl text-blue-600 mr-4" />,
                                bgColor: "bg-gradient-to-r from-blue-50 to-purple-50",
                            },
                            {
                                title: "Collaboration",
                                description: "We highly value teamwork and collective effort, recognizing that meaningful progress is achieved through shared ideas and mutual respect.",
                                icon: <FaHandsHelping className="text-4xl text-green-600 mr-4" />,
                                bgColor: "bg-gradient-to-r from-green-50 to-blue-50",
                            },
                            {
                                title: "Commitment",
                                description: "We are dedicated to excellence and integrity in everything we do. Our commitment to the growth and well-being of our faculty and students drives us to maintain the highest standards in teaching, research, and support.",
                                icon: <FaHeart className="text-4xl text-red-600 mr-4" />,
                                bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
                            },
                            {
                                title: "Liking",
                                description: "We strive to create an environment where everyone feels valued, respected, and inspired. By cultivating a sense of belonging, we make our institution a place where people love to learn, work, and grow.",
                                icon: <FaUsers className="text-4xl text-purple-600 mr-4" />,
                                bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
                            },
                        ].map((value, index) => (
                            <div
                                key={index}
                                ref={(el) => (coreValuesCardsRefs.current[index] = el)} // Assign ref to each card
                                className={`bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-200`}
                            >
                                <div className="flex items-center mb-4">
                                    {value.icon}
                                    <h4 className="text-xl font-bold">{value.title}</h4>
                                </div>
                                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Awards and Achievement */}
                {/* <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">Awards and Achievement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Youth Fest",
                                description: "A celebration of youth talent and creativity, showcasing the best in arts, culture, and innovation.",
                                image: "./src/assets/images/youth_fest/IMG_2823.JPG",
                            },
                            {
                                title: "Talent Hunt",
                                description: "An event to discover and nurture hidden talents, providing a platform for students to shine.",
                                image: "../src/assets/images/tallent_hunt/thimg.jpeg",
                            },
                            {
                                title: "Ganesh Chaturthi",
                                description: "A grand sports festival promoting physical fitness, teamwork, and competitive spirit among students.",
                                image: "./src/assets/images/ganesh_chaturthi/GC1.JPG",
                            },
                        ].map((award, index) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <img
                                    className="w-full h-48 object-cover rounded-t-lg"
                                    src={award.image}
                                    alt={award.title}
                                />
                                <div className="absolute  inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition-opacity duration-300"></div>
                                <div className="absolute  -inset-10 inset-x-5 pb-3 flex flex-col justify-end text-white">
                                   
                                    <h4 className="text-xl font-bold   transition-transform duration-500 group-hover:-translate-y-12">
                                        {award.title}
                                    </h4>
                                  
                                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-40 group-hover:-translate-y-12">
                                        {award.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
            <AboutAnimation
                aboutSectionRef={aboutSectionRef}
                directorMessageRef={directorMessageRef}
                purposeRef={purposeRef}
                visionRef={visionRef}
                missionRef={missionRef}
                coreValuesRef={coreValuesRef}
                coreValuesCardsRefs={coreValuesCardsRefs}
                paragraphSectionRef={paragraphSectionRef}
                imageRef={imageRef}
                directorImageRef={directorImageRef}
                directorParagraphsRef={directorParagraphsRef}
                directorNameRef={directorNameRef}
            />
            <Footer />
            <ScrollToTop />
            <br />
            <br />
            <br />
            <br />
            <br />

        </>
    );
}