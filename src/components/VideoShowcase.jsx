import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lite-youtube-embed/src/lite-yt-embed.css';
import 'lite-youtube-embed';

gsap.registerPlugin(ScrollTrigger);

// Realistic architectural visualization YouTube videos
const videos = [
    { id: 'BFUczoLv-7I', title: 'Architectural 3D Walkthrough Showcase' },
    { id: 'CCF8jQR_um0', title: 'Photoreal Archviz Reel' },
    { id: 'Egmjj1btmLs', title: 'Cinematic Interior Walkthrough' },
    { id: 'ejbw7iOSZTA', title: 'Unreal Engine Archviz' },
];

export default function VideoShowcase() {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".video-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="videos" ref={sectionRef} className="py-24 md:py-32 bg-[#E4E4E7] px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
                    <div className="max-w-3xl">
                        <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">Cinematic Motion</h2>
                        <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#52525B] leading-[1.1] tracking-tight">
                            Spaces in <span className="font-serif italic font-normal text-[#F97316]">Motion.</span>
                        </h3>
                    </div>
                    <p className="text-[#6B7280] max-w-xs text-lg text-balance pb-2">
                        Experience our 3D environments through immersive, high-fidelity video walkthroughs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {videos.map((vid, i) => (
                        <div key={vid.id} className="video-card relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group bg-black">
                            <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#F97316]/50 transition-colors duration-500 rounded-[2rem] z-20 pointer-events-none" />
                            <lite-youtube
                                videoid={vid.id}
                                playlabel={vid.title}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundImage: `url(https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg)` }}
                            ></lite-youtube>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
