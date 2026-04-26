import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { SERVICE_BY_SLUG } from '../content/services';
import { POST_BY_SLUG } from '../content/blog';
import { isPreviewMode } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function ServicePage() {
    const { slug } = useParams();
    const s = SERVICE_BY_SLUG[slug];
    if (!s) return <Navigate to="/services" replace />;
    const preview = isPreviewMode();
    if (s.draft && !preview) return <Navigate to="/services" replace />;

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: s.name, path: `/services/${s.slug}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.name,
        description: s.description,
        url: `${SITE_URL}/services/${s.slug}`,
        provider: { '@id': ORG_ID },
        areaServed: ['India', 'United Arab Emirates', 'United States', 'Canada', 'United Kingdom'],
        serviceType: s.category,
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/services/${s.slug}`,
            availability: 'https://schema.org/InStock',
            priceCurrency: 'INR',
            description: s.pricing,
        },
    };

    const relatedPosts = (s.relatedBlog || []).map((slug) => POST_BY_SLUG[slug]).filter((p) => p && !p.draft);

    return (
        <>
            <Seo
                title={s.title}
                description={s.description}
                path={`/services/${s.slug}`}
                image={s.gallery?.[0]?.src}
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
                noIndex={s.draft}
            />
            <PageHero
                eyebrow={s.category}
                title={s.h1}
                subtitle={s.intro}
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12">
                <div className="max-w-5xl mx-auto pb-12">
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{s.secondary}</p>
                </div>

                {s.gallery && s.gallery.length > 0 && (
                    <div className="max-w-6xl mx-auto pb-16">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {s.gallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.src}
                                    alt={img.alt}
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    className="w-full h-64 md:h-80 object-cover rounded-2xl"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Types of {s.name.toLowerCase()} we deliver</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {s.types.map((t) => (
                            <div key={t.name} className="bg-gray-50 rounded-2xl p-5">
                                <h3 className="font-bold text-[#52525B] mb-1">{t.name}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Our process</h2>
                    <ol className="space-y-3">
                        {s.process.map((step, i) => (
                            <li key={i} className="flex gap-4 bg-white border border-gray-200 rounded-2xl p-4">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-[#F97316] text-white font-bold flex items-center justify-center text-sm">{i + 1}</span>
                                <span className="text-[#52525B] text-base leading-relaxed pt-1">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="max-w-5xl mx-auto pb-16 grid md:grid-cols-3 gap-4">
                    <div className="bg-[#52525B] text-white rounded-2xl p-6">
                        <h3 className="text-xs uppercase tracking-wider opacity-70 mb-2">Software</h3>
                        <p className="text-sm leading-relaxed">{s.software}</p>
                    </div>
                    <div className="bg-[#52525B] text-white rounded-2xl p-6">
                        <h3 className="text-xs uppercase tracking-wider opacity-70 mb-2">Turnaround</h3>
                        <p className="text-sm leading-relaxed">{s.turnaround}</p>
                    </div>
                    <div className="bg-[#F97316] text-white rounded-2xl p-6">
                        <h3 className="text-xs uppercase tracking-wider opacity-90 mb-2">Pricing</h3>
                        <p className="text-sm leading-relaxed">{s.pricing}</p>
                    </div>
                </div>

                {(s.related?.length > 0 || relatedPosts.length > 0) && (
                    <div className="max-w-5xl mx-auto pb-12">
                        {s.related?.length > 0 && (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold text-[#52525B] mb-4 tracking-tight">Related services</h2>
                                <div className="flex flex-wrap gap-3 mb-10">
                                    {s.related.map((rs) => {
                                        const rel = SERVICE_BY_SLUG[rs];
                                        if (!rel || rel.draft) return null;
                                        return (
                                            <Link key={rs} to={`/services/${rs}`} className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-[#F97316] hover:text-white rounded-full text-sm font-medium text-[#52525B] transition-colors">
                                                {rel.name} <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {relatedPosts.length > 0 && (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold text-[#52525B] mb-4 tracking-tight">Read next</h2>
                                <ul className="space-y-2">
                                    {relatedPosts.map((p) => (
                                        <li key={p.slug}>
                                            <Link to={`/blog/${p.slug}`} className="text-[#F97316] hover:underline font-medium">{p.title} →</Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>

            <CtaBlock title={`Need ${s.name.toLowerCase()}?`} subtitle="Send us your CAD, SketchUp or PDF plans — we'll come back with a quote and turnaround within one business day." />
        </>
    );
}
