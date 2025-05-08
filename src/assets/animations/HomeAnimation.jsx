// components/HomeAnimation.jsx

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import animateButton from "../animations/Button";

gsap.registerPlugin(ScrollTrigger);

const HomeAnimation = ({
    videoRef,
    titleRef,
    aboutGUContentRef,
    neerjaMamRef,
    registrarRef,
    aboutGUImageRef,
    aboutCPCImageRef,
    programCardsRef,
    placementImagesRef,
    activityImagesRef,
    guButtonRef,
    cpcButtonRef,
    placementButtonRef,
    activityButtonRef,
    cpcContentRef,
    gpRef,
    viewUniMapButton,
    viewFloorMapButton

}) => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (guButtonRef.current) {
                animateButton(guButtonRef);
            }
            if (cpcButtonRef.current) {
                animateButton(cpcButtonRef);
            }
            if (placementButtonRef.current) {
                animateButton(placementButtonRef);
            }
            if (activityButtonRef.current) {
                animateButton(activityButtonRef);
            }
            if (viewUniMapButton.current) {
                animateButton(viewUniMapButton);
            }
            if (viewFloorMapButton.current) {
                animateButton(viewFloorMapButton);
            }
            
            gsap.fromTo(videoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" });
            gsap.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4, ease: "power1.out" });

            gsap.fromTo(aboutGUContentRef.current, { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: "power1.out",
                scrollTrigger: { trigger: aboutGUContentRef.current, start: "top 80%", toggleActions: "play" },
            });

            gsap.fromTo(aboutGUImageRef.current, { scale: 0.8, opacity: 0 }, {
                scale: 1, opacity: 1, duration: 1, ease: "power1.out",
                scrollTrigger: { trigger: aboutGUImageRef.current, start: "top 80%", toggleActions: "play" },
            });

            gsap.fromTo(neerjaMamRef.current, { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: "power1.out",
                scrollTrigger: { trigger: neerjaMamRef.current, start: "top 80%", toggleActions: "play" },
            });

            gsap.fromTo(registrarRef.current, { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power1.out",
                scrollTrigger: { trigger: registrarRef.current, start: "top 80%", toggleActions: "play" },
            });

            gsap.fromTo(aboutCPCImageRef.current, { scale: 0.8, opacity: 0 }, {
                scale: 1, opacity: 1, duration: 1, ease: "power1.out",
                scrollTrigger: { trigger: aboutCPCImageRef.current, start: "top 80%", toggleActions: "play" },
            });

            gsap.fromTo(cpcContentRef.current, { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: "power1.out",
                scrollTrigger: { trigger: cpcContentRef.current, start: "top 80%", toggleActions: "play" },
            });

            programCardsRef.current.forEach((card, index) => {
                gsap.fromTo(card, { x: 50, opacity: 0 }, {
                    x: 0, opacity: 1, duration: 0.5, delay: index * 0.2, ease: "power1.out",
                    scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play" },
                });
            });

            placementImagesRef.current.forEach((image, index) => {
                gsap.fromTo(image, { scale: 0.8, opacity: 0 }, {
                    scale: 1, opacity: 1, duration: 0.8, delay: index * 0.1, ease: "power1.out",
                    scrollTrigger: { trigger: image, start: "top 80%", toggleActions: "play" },
                });
            });

            activityImagesRef.current.forEach((image, index) => {
                gsap.fromTo(image, { scale: 0.8, opacity: 0 }, {
                    scale: 1, opacity: 1, duration: 0.8, delay: index * 0.1, ease: "power1.out",
                    scrollTrigger: { trigger: image, start: "top 80%", toggleActions: "play" },
                });
            });

            if (gpRef && gpRef.current) {
                gsap.fromTo(gpRef.current, { opacity: 0 }, {
                    opacity: 1, duration: 1, ease: "power1.out",
                    scrollTrigger: { trigger: gpRef.current, start: "top 80%", toggleActions: "play" },
                });
            }
        }, [videoRef, titleRef, aboutGUContentRef, neerjaMamRef, registrarRef, aboutGUImageRef, aboutCPCImageRef, programCardsRef, placementImagesRef, activityImagesRef, guButtonRef, cpcButtonRef, placementButtonRef, activityButtonRef, cpcContentRef, gpRef, viewUniMapButton, viewFloorMapButton]);
        return () => ctx.revert();
    }, [videoRef, titleRef, aboutGUContentRef, neerjaMamRef, registrarRef, aboutGUImageRef, aboutCPCImageRef, programCardsRef, placementImagesRef, activityImagesRef, guButtonRef, cpcButtonRef, placementButtonRef, activityButtonRef, cpcContentRef, gpRef, viewUniMapButton, viewFloorMapButton]);

    return null; // This component doesn't render anything
};

export default HomeAnimation;