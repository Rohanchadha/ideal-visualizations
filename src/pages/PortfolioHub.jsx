import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { PORTFOLIO } from '../content/portfolio';
import { onlyPublished } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function PortfolioHub() {
    const visible = onlyPublished(PORTFOLIO);
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Portfolio — Ideal Visualizations',
        url: `${SITE_URL}/portfolio`,
        about: { '@id': ORG_ID },
    };
    return (
        <>
            <Seo
                title="Portfolio | Ideal Visualizations — Architectural 3D Rendering Case Studies"
                description="Architectural 3D rendering case studies across India, the UAE, the US and Canada — residential, commercial, hospitality and turnkey."
                path="/portfolio"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Selected work"
                title="Portfolio"
                italic="case studies"
                subtitle="A representative sample of recent rendering, design and turnkey projects. Browse the full archive in our gallery."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visible.map((p) => (
                        <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group block bg-white border border-gray-200 hover:border-[#F97316] rounded-3xl overflow-hidden transition-all hover:shadow-xl">
                            {p.gallery?.[0] ? (
                                <img src={p.gallery[0]} alt={p.name} className="w-full h-52 object-cover" loading="lazy" width="800" height="500" />
                            ) : (
                                <div className="w-full h-52 bg-gradient-to-br from-[#52525B] to-[#111111] flex items-center justify-center text-white/30 text-xs">[Image to be added]</div>
                            )}
                            <div className="p-5">
                                <p className="text-[#F97316] font-semibold text-xs uppercase tracking-wider mb-1">{p.type} · {p.city}</p>
                                <h3 className="text-lg font-bold text-[#52525B] mb-2 group-hover:text-[#F97316] transition-colors">{p.name}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2">{p.scope}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="max-w-6xl mx-auto mt-10 text-center">
                    <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 bg-[#52525B] hover:bg-[#F97316] text-white rounded-full font-semibold transition-colors">
                        Browse the full gallery →
                    </Link>
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
