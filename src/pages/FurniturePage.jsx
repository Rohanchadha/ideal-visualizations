import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Layers, Compass,
    Square, CircleDot, Archive, Sofa, Armchair,
} from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Lightbox from '../components/Lightbox';
import { SITE_URL, ORG_ID } from '../config/seo';
import { GALLERY_IMAGES } from '../config/galleryManifest';

// Categories we offer — used in the "What we craft" section + JSON-LD.
const CATEGORIES = [
    {
        slug: 'console-tables',
        name: 'Console Tables',
        icon: Square,
        tag: 'Sculptural · Statement',
        copy: 'Architectural console tables built around a single idea — fluted bases, monolithic pedestals, arched silhouettes. Designed to anchor an entryway, hallway or living wall as a piece of functional sculpture.',
    },
    {
        slug: 'centre-tables',
        name: 'Centre Tables',
        icon: CircleDot,
        tag: 'Coffee · Cocktail · Living',
        copy: 'Coffee and cocktail tables shaped to your living space — round, oval, slab, nesting. We balance proportion, material and silhouette so the table belongs to the room, not the catalogue.',
    },
    {
        slug: 'wardrobes',
        name: 'Wardrobes',
        icon: Archive,
        tag: 'Built-in · Walk-in · Free-standing',
        copy: 'Bespoke wardrobes engineered around your room — sliding, hinged or walk-in. Internal layouts are planned to your wardrobe inventory, with hardware and finishes chosen for daily-use longevity.',
    },
    {
        slug: 'sofa-sets',
        name: 'Sofa Sets',
        icon: Sofa,
        tag: 'Modular · Sectional · Lounge',
        copy: 'Sofa and seating sets designed to scale — modular sectionals, classic three-seaters, low-slung lounge configurations. Frames, foam density, fabric and stitching are all specified by us, not subbed out.',
    },
    {
        slug: 'chairs',
        name: 'Chairs',
        icon: Armchair,
        tag: 'Dining · Accent · Lounge',
        copy: 'Dining, accent and lounge chairs crafted as standalone design statements or as a set. Solid-wood frames, sculpted backs, contrast upholstery — each detailed to sit, age and read beautifully.',
    },
];

/**
 * Parse a Furniture description like:
 *   AURELIA
 *
 *   Material: Premium Walnut Wood
 *
 *   Design Concept:
 *   A sculptural luxury console table ...
 *
 * into { name, material, designLabel, design, raw }.
 */
function parseFurniture(desc) {
    if (!desc) return { name: null, material: null, designLabel: 'Design', design: null, raw: '' };
    const lines = desc.split(/\r?\n/).map(l => l.trim());

    let name = null;
    let material = null;
    let designLabel = 'Design';
    const designLines = [];

    let mode = 'header'; // header → material → design

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        if (mode === 'header' && !name) {
            name = line;
            mode = 'await-material';
            continue;
        }

        const matMatch = line.match(/^Material\s*:\s*(.+)$/i);
        if (matMatch) {
            material = matMatch[1].trim();
            mode = 'await-design';
            continue;
        }

        const designMatch = line.match(/^(Design(?:\s+Concept)?)\s*:\s*(.*)$/i);
        if (designMatch) {
            designLabel = designMatch[1];
            const tail = designMatch[2].trim();
            if (tail) designLines.push(tail);
            mode = 'design';
            continue;
        }

        if (mode === 'design' || mode === 'await-design' || mode === 'await-material') {
            designLines.push(line);
        }
    }

    return {
        name: name || null,
        material: material || null,
        designLabel,
        design: designLines.join(' ').trim() || null,
        raw: desc,
    };
}

function FurnitureSection({ item, index, onOpen }) {
    const meta = parseFurniture(item.description);
    const reverse = index % 2 === 1;
    const num = String(index + 1).padStart(2, '0');

    return (
        <article
            id={meta.name ? meta.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `piece-${index + 1}`}
            className="furniture-piece scroll-mt-28"
        >
            <div
                className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
            >
                {/* Image */}
                <button
                    type="button"
                    onClick={() => onOpen(index)}
                    className="lg:col-span-7 group relative block w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#EDEDED] aspect-[4/5] md:aspect-[4/3] cursor-zoom-in"
                    aria-label={`View ${meta.name || 'furniture piece'} larger`}
                >
                    <img
                        src={item.src}
                        alt={`${meta.name || 'Custom furniture piece'} — ${meta.material || 'designed by SLATE Concept Studios'}`}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute bottom-4 right-4 text-xs uppercase tracking-[0.2em] text-white/0 group-hover:text-white/90 transition-colors">
                        Tap to enlarge
                    </span>
                </button>

                {/* Copy */}
                <div className="lg:col-span-5">
                    <div className="flex items-baseline gap-4 mb-4">
                        <span className="font-mono text-xs tracking-[0.25em] text-[#F97316]">{num}</span>
                        <span className="h-px flex-1 bg-[#52525B]/15" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#52525B]/60">
                            Furniture
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a] leading-[1.02] mb-6">
                        {meta.name || 'Untitled'}
                    </h2>

                    <dl className="space-y-5 text-[#3f3f46]">
                        {meta.material && (
                            <Spec icon={<Layers className="w-4 h-4" />} label="Material">
                                {meta.material}
                            </Spec>
                        )}
                        {meta.design && (
                            <Spec icon={<Compass className="w-4 h-4" />} label={meta.designLabel}>
                                {meta.design}
                            </Spec>
                        )}
                    </dl>
                </div>
            </div>
        </article>
    );
}

function Spec({ icon, label, children }) {
    return (
        <div>
            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F97316] mb-2 font-semibold">
                <span className="text-[#F97316]">{icon}</span> {label}
            </dt>
            <dd className="text-base md:text-lg leading-relaxed text-[#3f3f46]">{children}</dd>
        </div>
    );
}

export default function FurniturePage() {
    const items = useMemo(
        () => GALLERY_IMAGES.filter(i => i.theme === 'Furniture'),
        []
    );

    const [lightboxIndex, setLightboxIndex] = useState(null);

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Furniture', path: '/furniture' },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        url: `${SITE_URL}/furniture`,
        name: 'Signature Furniture Collection — SLATE Concept Studios',
        description:
            'Bespoke furniture designed and visualized by SLATE Concept Studios — console tables, centre tables, wardrobes, sofa sets and chairs in walnut, oak, ash, maple, mango, cherry, acacia and reclaimed wood.',
        about: { '@id': ORG_ID },
        hasPart: [
            ...CATEGORIES.map((c, idx) => ({
                '@type': 'OfferCatalog',
                position: idx + 1,
                name: c.name,
                description: c.copy,
                url: `${SITE_URL}/furniture#${c.slug}`,
            })),
            ...items.map((it, idx) => {
                const meta = parseFurniture(it.description);
                return {
                    '@type': 'Product',
                    position: CATEGORIES.length + idx + 1,
                    name: meta.name || `Furniture piece ${idx + 1}`,
                    description: meta.design || meta.raw || undefined,
                    material: meta.material || undefined,
                    image: it.src,
                    brand: { '@type': 'Brand', name: 'SLATE Concept Studios' },
                    category: 'Bespoke Furniture',
                };
            }),
        ],
    };

    return (
        <>
            <Seo
                title="Signature Furniture Collection | SLATE Concept Studios"
                description="Bespoke furniture by SLATE Concept Studios — console tables, centre tables, wardrobes, sofa sets and chairs designed in premium woods and visualized at photoreal quality."
                path="/furniture"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Signature Collection"
                title="Bespoke furniture, designed to"
                italic="last a generation."
                subtitle="Console tables, centre tables, wardrobes, sofa sets and chairs — sculpted in walnut, oak, ash, maple, mango, cherry, acacia and reclaimed wood. Each design is concept-led, materially honest and built around a single architectural idea."
                breadcrumb={breadcrumb}
            />

            {items.length === 0 ? (
                <section className="px-6 md:px-12 py-24 text-center">
                    <p className="text-[#6B7280] text-lg">
                        New collection coming soon. In the meantime, see our full{' '}
                        <Link to="/portfolio" className="text-[#F97316] underline">portfolio</Link>.
                    </p>
                </section>
            ) : (
                <section className="px-6 md:px-12 py-16 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto space-y-24 md:space-y-32 lg:space-y-40">
                        {items.map((item, i) => (
                            <FurnitureSection
                                key={item.id}
                                item={item}
                                index={i}
                                onOpen={setLightboxIndex}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Categories we craft */}
            <section className="px-6 md:px-12 py-20 md:py-28 bg-[#F7F5F1] border-y border-[#52525B]/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-end mb-14 md:mb-20">
                        <div className="lg:col-span-7">
                            <p className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-xs md:text-sm">
                                What we craft
                            </p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-[1.05] tracking-tight">
                                Five categories,{' '}
                                <span className="font-serif italic font-normal text-[#F97316]">one studio.</span>
                            </h2>
                        </div>
                        <div className="lg:col-span-5 lg:pb-2">
                            <div className="hidden lg:block h-px w-12 bg-[#F97316] mb-5" />
                            <p className="text-[#6B7280] text-base md:text-lg leading-relaxed max-w-md">
                                Beyond the signature pieces above, we design and deliver custom furniture across five core categories — every brief starts with a sketch and a material conversation.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {CATEGORIES.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <article
                                    key={c.slug}
                                    id={c.slug}
                                    className="scroll-mt-28 group bg-white border border-[#52525B]/10 rounded-[1.75rem] p-7 md:p-8 hover:border-[#F97316]/60 hover:shadow-lg transition-all flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="w-12 h-12 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-center group-hover:bg-[#F97316] transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </span>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#52525B]/50">
                                            {String(i + 1).padStart(2, '0')} · Category
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-[1.65rem] font-bold text-[#1a1a1a] tracking-tight mb-1">
                                        {c.name}
                                    </h3>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#F97316] font-semibold mb-4">
                                        {c.tag}
                                    </p>
                                    <p className="text-[#52525B] text-base leading-relaxed">{c.copy}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
                        {CATEGORIES.map((c) => (
                            <a
                                key={c.slug}
                                href={`#${c.slug}`}
                                className="px-4 py-2 rounded-full border border-[#52525B]/20 text-[#52525B] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                            >
                                {c.name}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing strip */}
            <section className="px-6 md:px-12 pb-12">
                <div className="max-w-5xl mx-auto border-t border-[#52525B]/15 pt-12 text-center">
                    <p className="text-[#52525B]/70 text-sm uppercase tracking-[0.25em] mb-4">
                        Want a piece designed for your space?
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-6">
                        We design custom furniture to brief.
                    </h3>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-7 py-3.5 rounded-full font-semibold"
                    >
                        Start a commission <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <CtaBlock
                title="Bring your idea to the workshop."
                subtitle="Send us a sketch, a reference image, or just a feeling. We'll come back with concept sketches and material options within one business day."
                whatsappMessage="Hi SLATE — I'd like to discuss a custom furniture piece."
            />

            {lightboxIndex !== null && (
                <Lightbox
                    items={items}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onIndexChange={setLightboxIndex}
                />
            )}
        </>
    );
}
