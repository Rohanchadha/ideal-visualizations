import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { PORTFOLIO_BY_SLUG } from '../content/portfolio';
import { isPreviewMode } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function PortfolioPage() {
    const { slug } = useParams();
    const p = PORTFOLIO_BY_SLUG[slug];
    if (!p) return <Navigate to="/portfolio" replace />;
    if (p.draft && !isPreviewMode()) return <Navigate to="/portfolio" replace />;

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: p.name, path: `/portfolio/${p.slug}` },
    ];

    const images = (p.gallery || []).map((src) => ({
        '@type': 'ImageObject',
        contentUrl: `${SITE_URL}${src}`,
        url: `${SITE_URL}${src}`,
    }));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: p.name,
        url: `${SITE_URL}/portfolio/${p.slug}`,
        creator: { '@id': ORG_ID },
        about: p.type,
        locationCreated: { '@type': 'Place', name: p.city },
        keywords: p.services.join(', '),
        image: images.length ? images : undefined,
    };

    return (
        <>
            <Seo
                title={`${p.name} — ${p.type} Case Study | Ideal Visualizations`}
                description={`${p.name} (${p.city}): ${p.scope}`.slice(0, 155)}
                path={`/portfolio/${p.slug}`}
                image={p.gallery?.[0]}
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
                noIndex={p.draft}
            />
            <PageHero
                eyebrow={`${p.type} · ${p.city}`}
                title={p.name}
                subtitle={p.scope}
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12">
                {p.gallery && p.gallery.length > 0 && (
                    <div className="max-w-6xl mx-auto pb-12">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {p.gallery.map((src, i) => (
                                <img key={i} src={src} alt={`${p.name} — view ${i + 1}`} className="w-full h-72 object-cover rounded-2xl" loading="lazy" width="800" height="600" />
                            ))}
                        </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto pb-12 grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">Client</h3>
                        <p className="text-[#52525B] font-medium">{p.clientType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">Software</h3>
                        <p className="text-[#52525B] font-medium">{p.software}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">Services</h3>
                        <p className="text-[#52525B] font-medium">{p.services.join(' · ')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">Turnaround</h3>
                        <p className="text-[#52525B] font-medium">{p.turnaround}</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto pb-8 space-y-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-3 tracking-tight">The challenge</h2>
                        <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{p.challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-3 tracking-tight">Our approach</h2>
                        <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{p.solution}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-3 tracking-tight">Outcome</h2>
                        <p className="text-[#6B7280] text-base md:text-lg leading-relaxed italic">{p.results}</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto pb-12 text-center">
                    <Link to="/portfolio" className="text-[#F97316] hover:underline font-semibold">← Back to all case studies</Link>
                </div>
            </div>

            <CtaBlock title="Have a similar project?" />
        </>
    );
}
