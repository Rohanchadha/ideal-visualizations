import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';
import { PRIORITY_CITIES, STUDIO_BASE_CITY } from '../config/site';

gsap.registerPlugin(ScrollTrigger);

const otherLocations = [
    "Jalandhar",
    "Mohali",
    "Bathinda",
    "Manali",
    "Shimla",
    "Dubai",
    "Mumbai",
    "Bangalore",
    "Noida",
    "Gurgaon",
    "Hyderabad",
    "Kolkata",
    "Canada"
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
                    <MapPin size={18} /> Where we work
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#52525B] leading-[1.1] tracking-tight mb-6">
                    The locations that we <span className="font-serif italic font-normal text-[#F97316]">operate in.</span>
                </h3>
                <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mb-12">
                    The studio is based in {STUDIO_BASE_CITY}. Residential architecture, interiors and turnkey
                    work is focused on the cities below — we confirm execution availability for your specific
                    site and scope before committing.
                </p>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {PRIORITY_CITIES.map((loc, i) => (
                        <div
                            key={i}
                            className="location-pill shrink-0 whitespace-nowrap bg-white border border-gray-200 px-5 h-10 md:px-6 md:h-12 rounded-full text-[15px] md:text-base font-medium text-[#52525B] shadow-sm transition-all flex items-center justify-center gap-2.5"
                        >
                            <div className="shrink-0 w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                            <span className="leading-none pt-0.5">{loc}</span>
                            {loc === STUDIO_BASE_CITY && (
                                <span className="text-[11px] uppercase tracking-wide text-[#F97316] font-semibold leading-none pt-0.5">Studio base</span>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mt-14 mb-6">
                    <strong className="text-[#52525B]">3D visualization is delivered remotely</strong>, so rendering,
                    walkthrough and 360° work is not limited to those cities. We have produced visualization
                    for clients in:
                </p>

                <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
                    {otherLocations.map((loc, i) => (
                        <div
                            key={i}
                            className="location-pill shrink-0 whitespace-nowrap bg-transparent border border-gray-300 px-4 h-9 md:px-5 md:h-10 rounded-full text-sm md:text-[15px] font-medium text-[#6B7280] flex items-center justify-center"
                        >
                            <span className="leading-none pt-0.5">{loc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
