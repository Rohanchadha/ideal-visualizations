import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Zap, Globe, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    { icon: <Users size={32} />, title: "Client Centric", desc: "Your vision is our blueprint. We prioritize your needs and collaborate closely to guarantee the final render exceeds your highest expectations." },
    { icon: <Zap size={32} />, title: "Fast Delivery", desc: "We utilize optimized rendering pipelines and powerful hardware to deliver uncompromising quality within your critical deadlines." },
    { icon: <Globe size={32} />, title: "Global Standard", desc: "Our 3D artifacts compete on the world stage, meeting the stringent quality requirements of international architecture firms and developers." },
    { icon: <ShieldCheck size={32} />, title: "Precision Driven", desc: "Every millimeter matters. We translate CAD and architectural plans into 3D with microscopic accuracy and photorealistic verisimilitude." }
];

const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "1500+", label: "Completed Projects" },
    { value: "20+", label: "Cities Worldwide" },
    { value: "500+", label: "Happy Clients" }
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

            // Animate Stats
            gsap.fromTo(".stat-item",
                { scale: 0.8, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".stats-container",
                        start: "top 80%",
                    },
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.5)"
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
                        Why Choose <span className="font-serif italic font-normal text-[#F97316]">Ideal Visualizations?</span>
                    </h3>
                </div>

                {/* 4 Core Features */}
                <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 mb-24">
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

                {/* Expertise Stats Banner */}
                <div className="stats-container bg-[#52525B] rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
                    {/* Subtle noise/texture overlay for the dark banner */}
                    <div className="absolute inset-0 bg-[#F97316]/5 pointer-events-none mix-blend-overlay"></div>

                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-item flex flex-col items-center">
                                <span className="text-5xl md:text-6xl font-bold font-serif mb-2 text-[#F97316]">{stat.value}</span>
                                <span className="text-gray-300 font-medium tracking-wide uppercase text-sm">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
