import React, { lazy, Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, Play, X, MapPin, Building2 } from 'lucide-react';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { GALLERY_IMAGES, GALLERY_VIDEOS } from '../config/galleryManifest';

const ALL = '__all__';
const PAGE_SIZE = 24;
const Lightbox = lazy(() => import('../components/Lightbox'));
const THEME_ORDER = new Map(['construction', 'interior', 'plan', 'exterior', 'furniture'].map((theme, index) => [theme, index]));
const themeRank = item => THEME_ORDER.get(item.theme?.trim().toLowerCase()) ?? THEME_ORDER.size;
const ORDERED_IMAGES = [...GALLERY_IMAGES].sort((first, second) => themeRank(first) - themeRank(second));
const ORDERED_VIDEOS = [...GALLERY_VIDEOS].sort((first, second) => themeRank(first) - themeRank(second));

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

function Select({ label, value, onChange, options }) {
    return (
        <label className="flex flex-col gap-1 text-xs">
            <span className="text-white/60 uppercase tracking-wider">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:border-amber-500/60"
                >
                    <option value={ALL}>All</option>
                    {options.map((o) => (
                        <option key={o} value={o} className="bg-slate-900">{o}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
        </label>
    );
}

function TabBtn({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${active
                ? 'bg-amber-500 text-slate-900'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
        >
            {children}
        </button>
    );
}

function ImageCard({ item, onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="group text-left bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition flex flex-col"
        >
            <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative">
                <img
                    src={item.thumb || item.src}
                    alt={item.description || item.clientName || 'Project image'}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="300"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                />
                {item.theme && (
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-slate-900/80 text-amber-400 px-2 py-1 rounded">
                        {item.theme}
                    </span>
                )}
            </div>
            <div className="p-3 flex flex-col gap-1.5 flex-1">
                {item.description && (
                    <p className="text-sm text-white/85 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-white/55">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{item.clientName || '—'}</span>
                </div>
                {(item.city || item.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-white/55">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                            {[item.city, item.state, item.country].filter(Boolean).join(', ')}
                        </span>
                    </div>
                )}
                {item.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {item.services.slice(0, 2).map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                                {s}
                            </span>
                        ))}
                        {item.services.length > 2 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded text-white/40">
                                +{item.services.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}

function VideoCard({ item, onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="group text-left bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition flex flex-col"
        >
            <div className="aspect-video bg-slate-900 overflow-hidden relative flex items-center justify-center">
                {item.thumb ? (
                    <img
                        src={item.thumb}
                        alt={item.description || 'Project video'}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="225"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-900 flex items-center justify-center group-hover:scale-110 transition">
                        <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                    </div>
                </div>
                {item.theme && (
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-slate-900/80 text-amber-400 px-2 py-1 rounded">
                        {item.theme}
                    </span>
                )}
            </div>
            <div className="p-3 flex flex-col gap-1.5 flex-1">
                {item.description && (
                    <p className="text-sm text-white/85 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-white/55">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{item.clientName || '—'}</span>
                </div>
                {(item.city || item.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-white/55">
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

export default function GalleryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState('images');
    const [showFilters, setShowFilters] = useState(() => searchParams.has('theme'));
    const [lbIndex, setLbIndex] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const theme = searchParams.get('theme') || ALL;
    const [country, setCountry] = useState(ALL);
    const [city, setCity] = useState(ALL);
    const [clientType, setClientType] = useState(ALL);
    const [service, setService] = useState(ALL);

    const source = tab === 'images' ? ORDERED_IMAGES : ORDERED_VIDEOS;

    const themeOptions = useMemo(() => buildOptions(source, 'theme'), [source]);
    const countryOptions = useMemo(() => buildOptions(source, 'country'), [source]);
    const cityOptions = useMemo(() => buildOptions(source, 'city'), [source]);
    const clientTypeOptions = useMemo(() => buildOptions(source, 'clientType'), [source]);
    const serviceOptions = useMemo(() => buildOptions(source, 'services'), [source]);

    const filtered = useMemo(() => {
        return source.filter((it) => {
            if (theme !== ALL && it.theme !== theme) return false;
            if (country !== ALL && it.country !== country) return false;
            if (city !== ALL && it.city !== city) return false;
            if (clientType !== ALL && it.clientType !== clientType) return false;
            if (service !== ALL && !(it.services || []).includes(service)) return false;
            return true;
        });
    }, [source, theme, country, city, clientType, service]);

    const activeFilterCount = [theme, country, city, clientType, service].filter((v) => v !== ALL).length;
    const visibleItems = filtered.slice(0, visibleCount);

    function setTheme(value) {
        setLbIndex(null);
        setVisibleCount(PAGE_SIZE);
        setSearchParams(previous => {
            const next = new URLSearchParams(previous);
            if (value === ALL) next.delete('theme');
            else next.set('theme', value);
            return next;
        }, { replace: true });
    }

    function resetFilters() {
        setTheme(ALL); setCountry(ALL); setCity(ALL); setClientType(ALL); setService(ALL);
    }

    function updateFilter(setter) {
        return value => {
            setter(value);
            setVisibleCount(PAGE_SIZE);
            setLbIndex(null);
        };
    }

    function switchTab(t) {
        setTab(t);
        resetFilters();
    }

    return (
        <div className="bg-slate-950 text-white min-h-screen">
            <Seo
                title="Gallery | SLATE Concept Studios"
                description="Browse our complete portfolio of architectural visualizations, 3D renderings, walkthroughs and interior design projects."
                path="/gallery"
            />

            <PageHero
                eyebrow="Gallery"
                title="Every project, in one place"
                subtitle="Filter by theme, country, client type or service to find work like yours."
            />

            <section className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs + filter toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <TabBtn active={tab === 'images'} onClick={() => switchTab('images')}>
                                Images <span className="opacity-60 ml-1">{GALLERY_IMAGES.length}</span>
                            </TabBtn>
                            <TabBtn active={tab === 'videos'} onClick={() => switchTab('videos')}>
                                Videos <span className="opacity-60 ml-1">{GALLERY_VIDEOS.length}</span>
                            </TabBtn>
                        </div>
                        <button
                            onClick={() => setShowFilters((s) => !s)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="text-[10px] bg-amber-500 text-slate-900 rounded-full px-1.5 py-0.5 font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter bar */}
                    {showFilters && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                <Select label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
                                <Select label="Country" value={country} onChange={updateFilter(setCountry)} options={countryOptions} />
                                <Select label="City" value={city} onChange={updateFilter(setCity)} options={cityOptions} />
                                <Select label="Client Type" value={clientType} onChange={updateFilter(setClientType)} options={clientTypeOptions} />
                                <Select label="Service" value={service} onChange={updateFilter(setService)} options={serviceOptions} />
                            </div>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="mt-3 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Result count */}
                    <p className="text-sm text-white/50 mb-4">
                        Showing {visibleItems.length} of {filtered.length} {tab}
                    </p>

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <div className={`grid gap-4 ${tab === 'images'
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}>
                            {visibleItems.map((item, i) =>
                                tab === 'images' ? (
                                    <ImageCard key={item.id} item={item} onOpen={() => setLbIndex(i)} />
                                ) : (
                                    <VideoCard key={item.id} item={item} onOpen={() => setLbIndex(i)} />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
                            <p className="text-white/60 mb-3">No {tab} match these filters.</p>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-amber-400 hover:text-amber-300"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                    {visibleCount < filtered.length && (
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm text-white hover:bg-white/10">
                                Load more {tab} <ChevronDown className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {lbIndex !== null && (
                <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 text-white" role="status">Loading preview...</div>}>
                <Lightbox
                    items={filtered}
                    index={lbIndex}
                    onClose={() => setLbIndex(null)}
                    onIndexChange={setLbIndex}
                />
                </Suspense>
            )}
        </div>
    );
}
