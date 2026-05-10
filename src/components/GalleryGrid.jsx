import React, { useState } from 'react';
import { Play, MapPin, Building2, Loader2, ImageIcon } from 'lucide-react';
import Lightbox from './Lightbox';

/**
 * Shared lazy-loading <img> with skeleton spinner + fade-in.
 * Used across all gallery surfaces (portfolio page, service pages, location pages).
 */
export function LazyImg({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full bg-[#F4F4F5] overflow-hidden">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#F97316] animate-spin" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                className={`${className || ''} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            />
        </div>
    );
}

export function ImageCard({ item, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="group text-left bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#F97316] hover:shadow-xl transition-all flex flex-col"
        >
            <div className="aspect-[4/3] overflow-hidden relative">
                <LazyImg
                    src={item.thumb || item.src}
                    alt={item.alt || item.description || item.clientName || 'Project image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {item.theme && (
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-white/95 backdrop-blur text-[#F97316] px-2.5 py-1 rounded-full font-semibold shadow-sm">
                        {item.theme}
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1">
                {item.description && (
                    <p className="text-sm text-[#52525B] font-medium line-clamp-2 leading-snug">{item.description}</p>
                )}
                {item.clientName && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{item.clientName}</span>
                    </div>
                )}
                {(item.city || item.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                            {[item.city, item.state, item.country].filter(Boolean).join(', ')}
                        </span>
                    </div>
                )}
                {item.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.services.slice(0, 2).map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#E4E4E7] text-[#52525B] font-medium">
                                {s}
                            </span>
                        ))}
                        {item.services.length > 2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full text-[#6B7280]">
                                +{item.services.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}

export function VideoCard({ item, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="group text-left bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#F97316] hover:shadow-xl transition-all flex flex-col"
        >
            <div className="aspect-video overflow-hidden relative bg-[#F4F4F5]">
                {item.thumb ? (
                    <LazyImg
                        src={item.thumb}
                        alt={item.alt || item.description || 'Project video'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#52525B] to-[#27272A] flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-white/20" />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[#F97316] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                    </div>
                </div>
                {item.theme && (
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-white/95 backdrop-blur text-[#F97316] px-2.5 py-1 rounded-full font-semibold shadow-sm">
                        {item.theme}
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1">
                {item.description && (
                    <p className="text-sm text-[#52525B] font-medium line-clamp-2 leading-snug">{item.description}</p>
                )}
                {item.clientName && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{item.clientName}</span>
                    </div>
                )}
                {(item.city || item.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                            {[item.city, item.state, item.country].filter(Boolean).join(', ')}
                        </span>
                    </div>
                )}
            </div>
        </button>
    );
}

/**
 * GalleryGrid — reusable grid of gallery cards with built-in lightbox.
 *
 * Props:
 *   items     — array of manifest items (image or video shape)
 *   variant   — 'image' (default) | 'video'
 *   columns   — Tailwind grid-cols class fragment override (optional)
 *   lightbox  — boolean, default true; set false to disable lightbox click
 */
export default function GalleryGrid({ items, variant = 'image', columns, lightbox = true }) {
    const [lbIndex, setLbIndex] = useState(null);
    if (!items || items.length === 0) return null;

    const Card = variant === 'video' ? VideoCard : ImageCard;
    const gridCols = columns || (variant === 'image'
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    );

    return (
        <>
            <div className={`grid gap-5 ${gridCols}`}>
                {items.map((item, i) => (
                    <Card
                        key={item.id || i}
                        item={item}
                        onOpen={() => lightbox && setLbIndex(i)}
                    />
                ))}
            </div>
            {lightbox && lbIndex !== null && (
                <Lightbox
                    items={items}
                    index={lbIndex}
                    onClose={() => setLbIndex(null)}
                    onIndexChange={setLbIndex}
                />
            )}
        </>
    );
}
