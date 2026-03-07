import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
        );

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-4 md:top-6 left-0 right-0 mx-auto z-40 transition-all duration-500 rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between gap-4 md:gap-16 w-[95%] sm:w-[90%] max-w-5xl ${scrolled
                ? 'bg-[#52525B]/95 backdrop-blur-xl shadow-xl text-white'
                : 'bg-transparent text-white'
                }`}
        >
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Expected to be placed at /public/logo.png */}
                <img src="/logo.png" alt="Ideal Visualizations Logo" className="h-6 md:h-8 w-auto rounded-sm bg-white/90 p-0.5 md:p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="font-bold tracking-tight text-sm md:text-xl whitespace-nowrap">Ideal Visualizations</span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm">
                {[
                    { label: 'Why Us', id: '#why-choose-us' },
                    { label: 'Cinema', id: '#videos' },
                    { label: 'Services', id: '#services' },
                    { label: 'Portfolio', id: '#portfolio' },
                    { label: 'About', id: '#about' },
                    { label: 'Locations', id: '#locations' }
                ].map((item) => (
                    <a
                        key={item.label}
                        href={item.id}
                        className="hover:-translate-y-0.5 transition-transform"
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <a
                href="#contact"
                className="magnetic-btn shrink-0 bg-[#F97316] text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md hover:bg-[#EA580C] overflow-hidden relative group whitespace-nowrap"
            >
                <span className="relative z-10">Contact Us</span>
            </a>
        </nav>
    );
}
