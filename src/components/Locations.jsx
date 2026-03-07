import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const locations = [
    "Chandigarh",
    "Amritsar",
    "Jalandhar",
    "Ludhiana",
    "Mohali",
    "Bathinda",
    "Manali",
    "Shimla",
    "Dubai",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Noida",
    "Gurgaon",
    "Hyderabad",
    "Kolkata"
];

export default function Locations() {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".location-pill",
                { scale: 0.8, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                    },
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "back.out(1.5)"
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="locations" ref={sectionRef} className="py-24 md:py-32 bg-[#E4E4E7] px-6 md:px-12 overflow-hidden relative">
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
                <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base flex items-center justify-center gap-2">
                    <MapPin size={18} /> Global Reach
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#52525B] leading-[1.1] tracking-tight mb-16">
                    The locations that we <span className="font-serif italic font-normal text-[#F97316]">operate in.</span>
                </h3>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {locations.map((loc, i) => (
                        <div
                            key={i}
                            className="location-pill shrink-0 whitespace-nowrap magnetic-btn bg-white border border-gray-200 px-5 h-10 md:px-6 md:h-12 rounded-full text-[15px] md:text-base font-medium text-[#52525B] shadow-sm hover:shadow-md hover:border-[#F97316] hover:text-[#F97316] cursor-default transition-all flex items-center justify-center gap-2.5"
                        >
                            <div className="shrink-0 w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                            <span className="leading-none pt-0.5">{loc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
