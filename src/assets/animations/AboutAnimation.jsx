// components/aboutAnimation.jsx

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutAnimation = ({
    aboutSectionRef,
    directorMessageRef,
    purposeRef,
    visionRef,
    missionRef,
    coreValuesRef,
    coreValuesCardsRefs,
    paragraphSectionRef,
    imageRef,
    directorImageRef,
    directorParagraphsRef,
    directorNameRef,
}) => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(aboutSectionRef.current, {
                opacity: 0,
                duration: 0.5,
            });

            if (paragraphSectionRef.current) {
                const paragraphs = paragraphSectionRef.current.querySelectorAll('p');
                gsap.from(paragraphs, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    stagger: 0.3,
                    scrollTrigger: {
                        trigger: paragraphSectionRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });
            }

            if (imageRef.current) {
                gsap.from(imageRef.current, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });
            }

            if (directorMessageRef.current) {
                gsap.from(directorImageRef.current, {
                    opacity: 0,
                    y: 50,
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: directorMessageRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });

                const paragraphs = directorParagraphsRef.current.querySelectorAll('p');
                gsap.from(paragraphs, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    stagger: 0.3,
                    scrollTrigger: {
                        trigger: directorMessageRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });

                gsap.from(directorNameRef.current, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: directorMessageRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });
            }

            if (purposeRef.current) {
                gsap.from([visionRef.current, missionRef.current], {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.3,
                    scrollTrigger: {
                        trigger: purposeRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });
            }

            if (coreValuesRef.current) {
                gsap.from(coreValuesCardsRefs.current, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: coreValuesRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play',
                    },
                });
            }

        }, aboutSectionRef);

        return () => ctx.revert();
    }, [
        aboutSectionRef,
        directorMessageRef,
        purposeRef,
        visionRef,
        missionRef,
        coreValuesRef,
        coreValuesCardsRefs,
        paragraphSectionRef,
        imageRef,
        directorImageRef,
        directorParagraphsRef,
        directorNameRef,
    ]);

    return null; // This component doesn't render anything
};

export default AboutAnimation;