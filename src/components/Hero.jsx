import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { trackEvent } from './Analytics';

// Hero cover image — "Modern Farmhouse" (Mr. Raman, Ideal Home Designers,
// Amritsar), sno 19 in the gallery manifest. Served from the same Google Drive
// CDN as the rest of the gallery.
const HERO_IMAGE = {
    src: 'https://lh3.googleusercontent.com/d/1sJJmeSj3CouF9161yIJApf2SuBaxw4HG=w1920',
    alt: 'Exterior 3D visualization of a modern farmhouse in Amritsar, not a site photograph',
};

export default function Hero() {
    const containerRef = useRef(null);
    const { openCallback } = useUI();

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
                opacity: 0.95,
                duration: 2,
                ease: "power2.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full min-h-[100svh] overflow-hidden flex items-end">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 bg-[#111111]">
                <img
                    src={HERO_IMAGE.src}
                    alt={HERO_IMAGE.alt}
                    width="1920"
                    height="1080"
                    fetchPriority="high"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center scale-105"
                />
                <div className="hero-image-overlay absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/35 via-45% to-transparent opacity-95 z-10" />
                {/* Gentle left-side falloff so the bottom-left copy stays legible
                    without flattening the render. */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B0B0B]/45 via-transparent to-transparent" />
            </div>

            {/* Content Container positioned at bottom-left */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-28 pb-16 md:pb-24">
                <div className="max-w-3xl text-white">
                    <h1 className="hero-text text-[2.25rem] leading-[1.08] sm:text-5xl md:text-6xl font-bold tracking-normal mb-5 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
                        <span className="block">Home construction</span>
                        <span className="block text-[#F5F5F4] mt-1 font-serif italic font-normal">in Amritsar.</span>
                    </h1>
                    <p className="hero-text text-base md:text-lg text-white/90 leading-[1.65] max-w-lg mb-8 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                        Turnkey construction, renovation and interiors, from the first plan to handover. Based in Amritsar, also serving homeowners in Ludhiana.
                    </p>
                    <div className="hero-text flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                        <button
                            onClick={() => { trackEvent('cta_callback_click', { location: 'hero' }); openCallback(); }}
                            className="magnetic-btn bg-[#F97316] hover:bg-[#EA580C] text-white px-7 py-3.5 rounded-full text-base font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 shadow-lg shadow-black/30"
                        >
                            <PhoneCall className="w-5 h-5" /> Request a Callback
                        </button>
                        <Link
                            to="/portfolio"
                            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-colors"
                        >
                            <span>Explore our work</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <p className="mt-6 text-xs text-white/75">Design visualization, not a site photograph</p>
                </div>
            </div>
        </section>
    );
}
