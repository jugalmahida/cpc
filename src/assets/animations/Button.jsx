import gsap from "gsap"; // Import GSAP

// Create a reusable animation function
export default function animateButton(buttonRef) {
    gsap.fromTo(
        buttonRef.current,
        { scale: 0.9, opacity: 0 }, // Start slightly smaller and transparent
        {
            scale: 1,
            opacity: 1,
            duration: 0.5, // Adjust as needed  
            ease: "power1.out",
            scrollTrigger: { // Optional: Animate on scroll
                trigger: buttonRef.current,
                start: "top 80%",
                toggleActions: "play",
            },
        }
    );
};