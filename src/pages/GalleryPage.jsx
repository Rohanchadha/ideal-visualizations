import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { ImageCard, VideoCard } from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';
import { GALLERY_IMAGES, GALLERY_VIDEOS } from '../config/galleryManifest';

const ALL = '__all__';
const PAGE_SIZE = 24;

function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function buildOptions(items, key) {
    const flat = items.flatMap((it) => {
        const v = it[key];
        return Array.isArray(v) ? v : [v];
    });
    return uniq(flat);
}

/**
 * Minimal native-looking select. Inline, not a card.
 */
function MiniSelect({ label, value, onChange, options }) {
    const isActive = value !== ALL;
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`appearance-none text-sm pl-3 pr-8 py-2 rounded-full border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 ${
                    isActive
                        ? 'bg-[#F97316] border-[#F97316] text-white font-medium'
                        : 'bg-white border-gray-200 text-[#52525B] hover:border-gray-300'
                }`}
            >
                <option value={ALL}>{label}</option>
                {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
            <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
        </div>
    );
}

export default function GalleryPage() {
    const [tab, setTab] = useState('images');
    const [lbIndex, setLbIndex] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const [theme, setTheme] = useState(ALL);
    const [country, setCountry] = useState(ALL);
    const [service, setService] = useState(ALL);

    const source = tab === 'images' ? GALLERY_IMAGES : GALLERY_VIDEOS;

    const themeOptions = useMemo(() => buildOptions(source, 'theme'), [source]);
    const countryOptions = useMemo(() => buildOptions(source, 'country'), [source]);
    const serviceOptions = useMemo(() => buildOptions(source, 'services'), [source]);

    const filtered = useMemo(() => {
        return source.filter((it) => {
            if (theme !== ALL && it.theme !== theme) return false;
            if (country !== ALL && it.country !== country) return false;
            if (service !== ALL && !(it.services || []).includes(service)) return false;
            return true;
        });
    }, [source, theme, country, service]);

    const activeCount = [theme, country, service].filter((v) => v !== ALL).length;

    function resetFilters() {
        setTheme(ALL); setCountry(ALL); setService(ALL);
    }

    function switchTab(t) {
        setTab(t);
        resetFilters();
        setVisibleCount(PAGE_SIZE);
    }

    // Reset visible count when filters change
    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [theme, country, service, tab]);

    // Infinite scroll sentinel
    const sentinelRef = useRef(null);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
            }
        }, { rootMargin: '600px' });
        io.observe(el);
        return () => io.disconnect();
    }, [filtered.length]);

    const visibleItems = filtered.slice(0, visibleCount);

    return (
        <div className="bg-[#E4E4E7] min-h-screen">
            <Seo
                title="Portfolio | SLATE Concept Studios"
                description="Browse our complete portfolio of architectural visualizations, 3D renderings, walkthroughs and interior design projects."
                path="/portfolio"
            />

            <PageHero
                eyebrow="Portfolio"
                title="Every project, in one place"
                subtitle="Filter by theme, region or service to find work like yours."
            />

            {/* Toolbar — sticky on mobile, static on desktop */}
            <div className="sticky top-16 md:static z-30 bg-[#E4E4E7]/85 md:bg-transparent backdrop-blur md:backdrop-blur-0 border-b md:border-b-0 border-gray-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {/* Tabs */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5 shrink-0">
                        <button
                            onClick={() => switchTab('images')}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${tab === 'images' ? 'bg-[#52525B] text-white' : 'text-[#6B7280] hover:text-[#52525B]'}`}
                        >
                            Images <span className="opacity-60 text-xs">· {GALLERY_IMAGES.length}</span>
                        </button>
                        <button
                            onClick={() => switchTab('videos')}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${tab === 'videos' ? 'bg-[#52525B] text-white' : 'text-[#6B7280] hover:text-[#52525B]'}`}
                        >
                            Videos <span className="opacity-60 text-xs">· {GALLERY_VIDEOS.length}</span>
                        </button>
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-gray-300 shrink-0" />

                    {/* Inline filter selects */}
                    <div className="flex items-center gap-2 shrink-0">
                        <SlidersHorizontal className="w-4 h-4 text-[#6B7280] hidden sm:block" />
                        <MiniSelect label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
                        <MiniSelect label="Region" value={country} onChange={setCountry} options={countryOptions} />
                        <MiniSelect label="Service" value={service} onChange={setService} options={serviceOptions} />
                    </div>

                    {activeCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="shrink-0 inline-flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#52525B] font-medium"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                    )}

                    <div className="ml-auto text-xs text-[#6B7280] shrink-0 hidden md:block">
                        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                    </div>
                </div>
            </div>

            <section className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {filtered.length > 0 ? (
                        <>
                            <div className={`grid gap-5 ${tab === 'images'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                }`}>
                                {visibleItems.map((item, i) =>
                                    tab === 'images' ? (
                                        <ImageCard key={item.id || i} item={item} onOpen={() => setLbIndex(i)} />
                                    ) : (
                                        <VideoCard key={item.id || i} item={item} onOpen={() => setLbIndex(i)} />
                                    )
                                )}
                            </div>
                            {visibleCount < filtered.length && (
                                <div ref={sentinelRef} className="h-20 flex items-center justify-center text-sm text-[#6B7280]">
                                    Loading more…
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl">
                            <p className="text-[#52525B] mb-3 font-medium">No {tab} match these filters.</p>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-[#F97316] hover:underline font-semibold"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {lbIndex !== null && (
                <Lightbox
                    items={visibleItems}
                    index={lbIndex}
                    onClose={() => setLbIndex(null)}
                    onIndexChange={setLbIndex}
                />
            )}
        </div>
    );
}
