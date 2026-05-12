import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '../config/galleryManifest';

gsap.registerPlugin(ScrollTrigger);

// Pull a name from a furniture description like "AURELIA\n\nMaterial: ..."
function getName(desc) {
    if (!desc) return null;
    const first = desc.split(/\r?\n/).map(s => s.trim()).find(Boolean);
    return first && !/^material/i.test(first) ? first : null;
}

export default function FurnitureTeaser() {
    const sectionRef = useRef(null);

    const items = useMemo(() => {
        const all = GALLERY_IMAGES.filter(i => i.theme === 'Furniture');
        return all.slice(0, 4);
    }, []);

    useEffect(() => {
        if (!items.length) return;
        const ctx = gsap.context(() => {
            gsap.from('.furn-teaser-card', {
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [items.length]);

    if (!items.length) return null;

    return (
        <section
            ref={sectionRef}
            id="furniture"
            className="py-24 md:py-32 px-4 md:px-8 bg-[#111111] text-white relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: 'url(/3D-Images/2.png)', backgroundSize: 'cover' }} />

            <div className="max-w-7xl mx-auto relative">
                <div className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-end mb-16 md:mb-20">
                    <div className="lg:col-span-7">
                        <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
                            Signature Collection
                        </h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                            Bespoke{' '}
                            <span className="font-serif italic font-normal text-[#F97316]">furniture.</span>
                        </h3>
                    </div>
                    <div className="lg:col-span-5 lg:pb-2">
                        <div className="hidden lg:block h-px w-12 bg-[#F97316] mb-5" />
                        <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md">
                            Sculptural console tables and statement pieces — designed in walnut, oak, ash and reclaimed wood, then visualised at photoreal quality.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    {items.map((it, i) => {
                        const name = getName(it.description);
                        return (
                            <Link
                                key={it.id}
                                to="/furniture"
                                className="furn-teaser-card group relative block overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white/5 aspect-[3/4]"
                            >
                                <img
                                    src={it.thumb}
                                    alt={`${name || 'Bespoke furniture piece'} — SLATE Concept Studios`}
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                                    <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60 mb-1">
                                        {String(i + 1).padStart(2, '0')} — Furniture
                                    </p>
                                    <p className="font-bold text-lg md:text-xl tracking-tight">
                                        {name || 'Statement Piece'}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 md:mt-16 flex justify-center">
                    <Link
                        to="/furniture"
                        className="magnetic-btn inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg shadow-lg transition-colors"
                    >
                        Explore the collection <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
