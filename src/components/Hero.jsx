import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-text", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });

            gsap.to(".hero-image-overlay", {
                opacity: 0.7,
                duration: 2,
                ease: "power2.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden flex items-end">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 bg-[#111111]">
                <img
                    src="/3D-Images/1.jpg"
                    alt="3D Architectural Rendering"
                    className="w-full h-full object-cover object-center scale-105"
                />
                <div className="hero-image-overlay absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/20 opacity-90 z-10" />
            </div>

            {/* Content Container positioned at bottom-left */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
                <div className="max-w-4xl text-white">
                    <p className="hero-text text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
                        Ideal Visualizations
                    </p>
                    <h1 className="hero-text text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-8">
                        <span className="block">Bringing architecture</span>
                        <span className="block text-[#E4E4E7]/90 mt-2 font-serif italic font-normal text-6xl md:text-8xl lg:text-[7rem]">to life.</span>
                    </h1>
                    <div className="hero-text flex flex-col sm:flex-row gap-4 items-center">
                        <a href="#services" className="magnetic-btn bg-[#F97316] text-white px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto text-center">
                            Explore Our Work
                        </a>
                        <a href="#portfolio" className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors px-6 py-4">
                            <span>View Gallery</span>
                            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
