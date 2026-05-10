import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { POSTS_BY_DATE } from '../content/blog';
import { onlyPublished } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

// Generate a smaller derivative for the listing card (Drive CDN supports =w<size>)
function listingThumb(src) {
    if (!src) return src;
    return src.replace(/=w\d+(?:-h\d+)?$/, '=w800');
}

function PostThumb({ src, alt }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-48 bg-[#F4F4F5] overflow-hidden">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#F97316] animate-spin" />
                </div>
            )}
            <img
                src={listingThumb(src)}
                alt={alt}
                width="800"
                height="450"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                className={`w-full h-48 object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}

export default function BlogIndex() {
    const visible = onlyPublished(POSTS_BY_DATE);
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        url: `${SITE_URL}/blog`,
        about: { '@id': ORG_ID },
        blogPost: visible.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.date,
        })),
    };
    return (
        <>
            <Seo
                title="Blog | SLATE Concept Studios — 3D Rendering Insights & Guides"
                description="Practical guides on architectural 3D rendering, walkthroughs, 360° tours, pricing, process, software and outsourcing — written for architects, designers and developers."
                path="/blog"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Insights"
                title="Blog &"
                italic="guides"
                subtitle="20+ deep-dive articles on architectural visualization — pricing, process, software, outsourcing, ROI and more."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
                    {visible.map((p) => (
                        <Link key={p.slug} to={`/blog/${p.slug}`} className="group block bg-white border border-gray-200 hover:border-[#F97316] rounded-3xl overflow-hidden transition-all hover:shadow-xl">
                            {p.image && (
                                <PostThumb src={p.image} alt={p.title} />
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                                    <span className="text-[#F97316] font-semibold uppercase tracking-wider">{p.category}</span>
                                    <span>·</span>
                                    <span>{p.readingTime} min read</span>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#52525B] mb-2 group-hover:text-[#F97316] transition-colors leading-snug">{p.title}</h2>
                                <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-3">{p.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
