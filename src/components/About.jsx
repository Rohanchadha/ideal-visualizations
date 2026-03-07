import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".about-content", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="py-24 md:py-32 px-6 md:px-12 bg-white flex flex-col items-center">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="about-content order-2 lg:order-1">
                    <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">Leading with Vision</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#52525B] leading-[1.1] tracking-tight mb-8">
                        Behind the <span className="font-serif italic font-normal text-[#F97316]">Renderings.</span>
                    </h3>
                    <div className="space-y-6 text-[#6B7280] text-lg leading-relaxed mix-blend-multiply">
                        <p>
                            Hi, I'm Danish. With over a decade of experience in architectural visualization, I founded Ideal Visualizations to bridge the gap between creative blueprints and photorealistic reality.
                        </p>
                        <p>
                            My philosophy is simple: every line has purpose, every shadow creates depth, and every render must tell a compelling story. We don't just build 3D models; we craft digital instruments that help architects, developers, and designers communicate their ultimate vision with absolute clarity.
                        </p>
                        <p className="border-l-2 border-[#F97316] pl-6 italic font-serif text-xl text-[#52525B] mt-10">
                            "Precision in design, passion in execution."
                        </p>
                    </div>
                </div>

                <div className="about-content order-1 lg:order-2 relative mx-auto w-full max-w-md">
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group">
                        <div className="absolute inset-0 bg-[#F97316]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img
                            src="/DanishProfilePicture.png"
                            alt="Danish - Founder"
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
