import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Eye, MapPin, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    { icon: <Users size={32} />, title: "We start with how you live", desc: "Before elevations or materials, we work through daily routines, family size, storage, privacy and daylight, so the plan suits your household rather than a template." },
    { icon: <Eye size={32} />, title: "See it before you build it", desc: "We use 3D visualization to explain design decisions — layout, light, proportion and finishes — so you can approve them with confidence instead of imagining them." },
    { icon: <MapPin size={32} />, title: "We discuss your actual site", desc: "Plot location, orientation, access, local approvals and what we can support there are confirmed in conversation before anything is promised." },
    { icon: <FileText size={32} />, title: "Scope agreed in writing", desc: "Deliverables, revisions, responsibilities and exclusions are set out in the proposal before appointment, so both sides know what is and is not included." }
];

export default function WhyChooseUs() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animate Features
            gsap.fromTo(".feature-card",
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="why-choose-us" ref={containerRef} className="py-24 md:py-32 px-6 md:px-12 bg-white relative">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">Our Advantage</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#52525B] tracking-tight">
                        Why Choose <span className="font-serif italic font-normal text-[#F97316]">SLATE Concept Studios?</span>
                    </h3>
                </div>

                {/* 4 Core Features */}
                <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
                    {features.map((item, i) => (
                        <div key={i} className="feature-card flex gap-6 p-8 rounded-[2rem] bg-[#E4E4E7]/20 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="shrink-0 text-[#6B7280] group-hover:text-[#F97316] transition-colors duration-300">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#52525B] mb-3">{item.title}</h4>
                                <p className="text-[#6B7280] leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
