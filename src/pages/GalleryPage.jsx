import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Film, Play, Maximize2 } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { GALLERY_IMAGES, GALLERY_VIDEOS } from '../config/site';

export default function GalleryPage() {
    const [tab, setTab] = useState('images'); // 'images' | 'videos'
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const prevTitle = document.title;
        const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const prevCanon = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        document.title = 'Gallery — Architectural 3D Renders & Walkthroughs | Ideal Visualizations';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Full gallery of photoreal architectural 3D renders, animated walkthroughs and 360° tours by Ideal Visualizations.');
        document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://ideal-visualizations.vercel.app/gallery');
        return () => {
            if (prevTitle) document.title = prevTitle;
            if (prevDesc) document.querySelector('meta[name="description"]')?.setAttribute('content', prevDesc);
            if (prevCanon) document.querySelector('link[rel="canonical"]')?.setAttribute('href', prevCanon);
        };
    }, []);

    const items = useMemo(() => (
        tab === 'images'
            ? GALLERY_IMAGES.map((img, i) => ({
                src: img.src,
                thumb: img.thumb || img.src,
                type: 'image',
                alt: `Architectural 3D rendering ${i + 1} — Ideal Visualizations gallery`,
            }))
            : GALLERY_VIDEOS.map((v) => ({ src: v.src, type: 'video' }))
    ), [tab]);

    return (
        <div className="min-h-screen bg-[#E4E4E7] text-[#52525B]">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-[#111111]/95 backdrop-blur-xl text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#F97316] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <span className="font-bold tracking-tight text-base sm:text-lg">Ideal Visualizations</span>
                </div>
            </header>

            {/* Hero */}
            <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-[#F97316] font-semibold tracking-wider uppercase mb-3 text-xs sm:text-sm">Our Work</h1>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Full <span className="font-serif italic font-normal text-[#F97316]">Gallery</span>
                    </h2>
                    <p className="mt-5 max-w-2xl mx-auto text-[#6B7280] text-base sm:text-lg">
                        Browse our complete archive of photoreal renders, walkthroughs and cinematic showcases.
                    </p>
                </div>
            </section>

            {/* Tab Switcher */}
            <div className="sticky top-[60px] z-20 bg-white/85 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-center">
                    <div className="inline-flex bg-[#E4E4E7] rounded-full p-1 shadow-inner">
                        <TabBtn active={tab === 'images'} onClick={() => setTab('images')} icon={<ImageIcon className="w-4 h-4" />}>
                            Images <span className="opacity-60 ml-1">({GALLERY_IMAGES.length})</span>
                        </TabBtn>
                        <TabBtn active={tab === 'videos'} onClick={() => setTab('videos')} icon={<Film className="w-4 h-4" />}>
                            Videos <span className="opacity-60 ml-1">({GALLERY_VIDEOS.length})</span>
                        </TabBtn>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <section className="px-4 sm:px-6 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto">
                    {tab === 'images' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {items.map((it, i) => (
                                <button
                                    type="button"
                                    key={it.src}
                                    onClick={() => setLightboxIndex(i)}
                                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                                >
                                    <img
                                        src={it.thumb}
                                        alt={it.alt}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                        <Maximize2 className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {items.map((it, i) => (
                                <button
                                    type="button"
                                    key={it.src}
                                    onClick={() => setLightboxIndex(i)}
                                    className="group relative aspect-video overflow-hidden rounded-2xl bg-black focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                                >
                                    <video
                                        src={it.src}
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F97316]/90 group-hover:bg-[#F97316] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all">
                                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {lightboxIndex !== null && (
                <Lightbox
                    items={items}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onIndexChange={setLightboxIndex}
                />
            )}

            <FloatingWhatsApp />
        </div>
    );
}

function TabBtn({ active, onClick, icon, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all ${active ? 'bg-[#F97316] text-white shadow' : 'text-[#52525B] hover:text-[#F97316]'}`}
        >
            {icon}
            {children}
        </button>
    );
}
