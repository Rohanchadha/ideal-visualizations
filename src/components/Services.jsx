import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Building2, Layers, Compass, Image as ImageIcon, Video, Home, Component, MonitorPlay, Ruler, BoxSelect } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    { icon: <Building2 className="w-8 h-8" />, title: "3D Architectural Visualization", desc: "Photorealistic rendering of exterior and interior spaces." },
    { icon: <Video className="w-8 h-8" />, title: "3D Walkthrough Services", desc: "Immersive animated walkthroughs of architectural projects." },
    { icon: <MonitorPlay className="w-8 h-8" />, title: "3D Engineering Animation", desc: "Detailed mechanical and engineering product animations." },
    { icon: <Box className="w-8 h-8" />, title: "3D Animations", desc: "High-quality custom 3D animation services." },
    { icon: <BoxSelect className="w-8 h-8" />, title: "3D Product Visualization", desc: "Cinematic rendering of consumer goods and products." },
    { icon: <Home className="w-8 h-8" />, title: "3D Interior Rendering", desc: "Stunning visualizations for interior designers and real estate." },
    { icon: <Compass className="w-8 h-8" />, title: "360 Virtual Tour", desc: "Interactive panoramic tours and VR experiences." },
    { icon: <Layers className="w-8 h-8" />, title: "3D Flythrough Animation", desc: "Sweeping aerial flyovers for master plans and communities." },
    { icon: <ImageIcon className="w-8 h-8" />, title: "3D Exterior Rendering", desc: "Crystal clear exterior architecture visualizations." },
    { icon: <Ruler className="w-8 h-8" />, title: "Architectural Plan Rendering", desc: "Beautifully rendered 2D and 3D floor plans." },
    { icon: <Component className="w-8 h-8" />, title: "3D Product Modeling", desc: "Precision CAD to 3D polygon modeling services." },
];

export default function Services() {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".service-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out"
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
                            Comprehensive <br className="hidden md:block" />
                            <span className="font-serif italic font-normal text-5xl md:text-6xl lg:text-7xl text-[#F97316]">3D solutions.</span>
                        </h3>
                    </div>
                    <p className="text-[#6B7280] max-w-sm text-lg text-balance">
                        We transform blueprints, sketches, and ideas into breathtaking photo-real imagery tailored for your success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="service-card magnetic-card bg-[#E4E4E7]/30 border border-gray-100 p-8 rounded-[2rem] hover:bg-white hover:border-gray-200 transition-colors group cursor-default"
                        >
                            <div className="mb-6 text-[#6B7280] group-hover:text-[#F97316] transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h4 className="text-xl font-bold text-[#52525B] mb-3 leading-tight">{service.title}</h4>
                            <p className="text-[#6B7280] leading-relaxed text-sm">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
