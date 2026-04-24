import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Building2, Compass, Sofa, KeyRound,
    Image as ImageIcon, Home, Footprints, RotateCcw, FileImage
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const archServices = [
    { icon: <Compass className="w-7 h-7" />, title: 'Architecture Planning', desc: 'Functional, future-ready architectural plans tailored to your site and brief.' },
    { icon: <Building2 className="w-7 h-7" />, title: 'Elevation Designing', desc: 'Distinctive façade and elevation design that defines your building\'s identity.' },
    { icon: <Sofa className="w-7 h-7" />, title: 'Interior Designing', desc: 'Curated interior layouts, materials and styling for residential & commercial spaces.' },
    { icon: <KeyRound className="w-7 h-7" />, title: 'Turnkey Projects', desc: 'End-to-end project execution — from concept to handover, hassle-free.' },
];

const vizServices = [
    { icon: <ImageIcon className="w-7 h-7" />, title: 'Exterior Renders', desc: 'Photorealistic exterior visualizations that bring elevations to life.' },
    { icon: <Home className="w-7 h-7" />, title: 'Interior Renders', desc: 'Detailed interior renderings with cinematic lighting and materials.' },
    { icon: <Footprints className="w-7 h-7" />, title: 'Walkthroughs', desc: 'Immersive animated walkthroughs that let clients experience the space.' },
    { icon: <RotateCcw className="w-7 h-7" />, title: '360 Views', desc: 'Interactive 360° panoramas for the web, VR and presentations.' },
    { icon: <FileImage className="w-7 h-7" />, title: 'Photoshop Rendered Plans', desc: 'Beautifully rendered 2D plans — perfect for marketing collateral.' },
];

export default function Services() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.service-card', {
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="services" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-white selection:bg-[#F97316] selection:text-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#52525B] leading-[1.1] tracking-tight">
                            What we <br className="hidden md:block" />
                            <span className="font-serif italic font-normal text-5xl md:text-6xl lg:text-7xl text-[#F97316]">deliver.</span>
                        </h3>
                    </div>
                    <p className="text-[#6B7280] max-w-sm text-lg text-balance">
                        Two studios under one roof — design and build the space, then visualize it in breathtaking photoreal quality.
                    </p>
                </div>

                {/* Category 1: Architecture & Construction */}
                <ServiceCategory
                    eyebrow="01 — Architecture & Construction"
                    title="Architecture & Construction"
                    italic="Services"
                    services={archServices}
                />

                {/* Category 2: 3D Visualization */}
                <div className="mt-20 md:mt-28">
                    <ServiceCategory
                        eyebrow="02 — 3D Visualization"
                        title="3D Visualization"
                        italic="Services"
                        services={vizServices}
                    />
                </div>
            </div>
        </section>
    );
}

function ServiceCategory({ eyebrow, title, italic, services }) {
    return (
        <div>
            <div className="mb-10 md:mb-12 flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-[#F97316] font-mono text-xs sm:text-sm tracking-widest uppercase mb-3">{eyebrow}</p>
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#52525B] tracking-tight">
                        {title} <span className="font-serif italic font-normal text-[#F97316]">{italic}</span>
                    </h4>
                </div>
                <div className="hidden md:block h-px flex-1 bg-gray-200 mb-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {services.map((s, i) => (
                    <div
                        key={i}
                        className="service-card magnetic-card bg-[#E4E4E7]/40 border border-gray-100 p-7 rounded-[1.75rem] hover:bg-white hover:border-gray-200 transition-colors group"
                    >
                        <div className="mb-5 text-[#6B7280] group-hover:text-[#F97316] transition-colors duration-300">
                            {s.icon}
                        </div>
                        <h5 className="text-lg md:text-xl font-bold text-[#52525B] mb-2 leading-tight">{s.title}</h5>
                        <p className="text-[#6B7280] leading-relaxed text-sm">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
