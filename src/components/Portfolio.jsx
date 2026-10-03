import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const images = [
    { src: '/3D-Images/1.jpg', alt: 'Twilight exterior render of a modern residential villa — SLATE Concept Studios', span: 'md:col-span-2 md:row-span-2' },
    { src: '/3D-Images/2.png', alt: 'Photorealistic interior 3D rendering with cinematic lighting', span: 'md:col-span-1 md:row-span-1' },
    { src: '/3D-Images/2 (2).jpg', alt: 'Day-time exterior architectural visualization, Punjab residence', span: 'md:col-span-1 md:row-span-2' },
    { src: '/3D-Images/2-37.jpg.jpeg', alt: 'Modern living room interior render with natural daylight', span: 'md:col-span-1 md:row-span-1' },
    { src: '/3D-Images/2-42.jpg.jpeg', alt: 'Hospitality interior 3D rendering, lobby concept', span: 'md:col-span-1 md:row-span-1' },
];

export default function Portfolio() {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".portfolio-item", {
                scrollTrigger: {
                    trigger: ".portfolio-grid",
                    start: "top 75%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="portfolio" ref={sectionRef} className="py-24 md:py-32 bg-[#E4E4E7] px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">Selected Works</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#52525B] tracking-tight">
                        Design <span className="font-serif italic font-normal">visualizations</span>
                    </h3>
                    <p className="mt-6 text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto">
                        These images are 3D visualizations produced by our studio, not photographs of
                        completed sites. We use them to show how a design is intended to look and to
                        agree decisions before anything is built.
                    </p>
                </div>

                <div className="portfolio-grid grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className={`portfolio-item relative overflow-hidden rounded-[2rem] ${img.span || ''}`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt || `3D visualization ${i + 1}`}
                                width="1200"
                                height="800"
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <span className="absolute bottom-3 left-3 z-10 bg-black/55 backdrop-blur-sm text-white/90 text-[11px] px-2.5 py-1 rounded-full tracking-wide">
                                3D visualization
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:mt-16 flex justify-center">
                    <Link
                        to="/portfolio"
                        className="magnetic-btn inline-flex items-center gap-2 bg-[#52525B] hover:bg-[#3f3f46] text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg shadow-lg"
                    >
                        View Full Portfolio <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
