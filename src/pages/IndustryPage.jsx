import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { INDUSTRY_BY_SLUG } from '../content/industries';
import { SERVICE_BY_SLUG } from '../content/services';
import { POST_BY_SLUG } from '../content/blog';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function IndustryPage() {
    const { slug } = useParams();
    const ind = INDUSTRY_BY_SLUG[slug];
    if (!ind) return <Navigate to="/services" replace />;

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/services' },
        { name: ind.audience, path: `/industries/${ind.slug}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `3D Rendering for ${ind.audience}`,
        description: ind.description,
        url: `${SITE_URL}/industries/${ind.slug}`,
        provider: { '@id': ORG_ID },
        audience: { '@type': 'Audience', audienceType: ind.audience },
        areaServed: ['India', 'United Arab Emirates', 'United States', 'Canada'],
    };

    const relatedPosts = (ind.relatedBlog || []).map((s) => POST_BY_SLUG[s]).filter(Boolean);

    return (
        <>
            <Seo title={ind.title} description={ind.description} path={`/industries/${ind.slug}`} jsonLd={jsonLd} breadcrumb={breadcrumb} />
            <PageHero eyebrow={`For ${ind.audience}`} title={ind.h1} subtitle={ind.subhead} breadcrumb={breadcrumb} />

            <div className="px-6 md:px-12">
                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">The problems we solve</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {ind.painPoints.map((p) => (
                            <div key={p.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                                <h3 className="font-bold text-[#52525B] mb-2">{p.title}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">How it works</h2>
                    <ol className="grid md:grid-cols-3 gap-4">
                        {ind.howItWorks.map((s) => (
                            <li key={s.step} className="bg-[#52525B] text-white rounded-2xl p-6">
                                <span className="text-[#F97316] font-bold text-sm">Step {s.step}</span>
                                <h3 className="font-bold text-lg mt-1 mb-2">{s.title}</h3>
                                <p className="text-white/80 text-sm leading-relaxed">{s.desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Services we deliver to {ind.audience.toLowerCase()}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ind.servicesShown.map((sl) => {
                            const s = SERVICE_BY_SLUG[sl];
                            if (!s) return null;
                            return (
                                <Link key={sl} to={`/services/${sl}`} className="block bg-white border border-gray-200 hover:border-[#F97316] rounded-2xl p-5 transition-colors">
                                    <h3 className="font-bold text-[#52525B] mb-1">{s.name}</h3>
                                    <p className="text-[#6B7280] text-sm">{s.description}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Recent {ind.audience.toLowerCase()} projects</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {ind.caseStudies.map((c, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-5">
                                <h3 className="font-bold text-[#52525B] mb-1">{c.name}</h3>
                                <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">{c.city}</p>
                                <p className="text-[#52525B] text-sm leading-relaxed mb-3">{c.scope}</p>
                                <p className="text-[#F97316] font-semibold text-sm">Turnaround: {c.turnaround}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Pricing</h2>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm md:text-base">
                            <thead className="bg-[#52525B] text-white">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Service</th>
                                    <th className="px-5 py-3 font-semibold">Indicative price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ind.pricing.map((p, i) => (
                                    <tr key={i} className="border-t border-gray-200">
                                        <td className="px-5 py-3 text-[#52525B]">{p.service}</td>
                                        <td className="px-5 py-3 text-[#6B7280]">{p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-3">Indicative ranges only. Every quote is custom — talk to us with your scope.</p>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {ind.faqs.map((f, i) => (
                            <details key={i} className="group bg-gray-50 rounded-2xl p-5">
                                <summary className="font-bold text-[#52525B] cursor-pointer list-none flex justify-between items-center">
                                    {f.q}
                                    <span className="text-[#F97316] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                                </summary>
                                <p className="text-[#6B7280] text-sm leading-relaxed mt-3">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {relatedPosts.length > 0 && (
                    <div className="max-w-5xl mx-auto pb-12">
                        <h2 className="text-xl md:text-2xl font-bold text-[#52525B] mb-4">Read next</h2>
                        <ul className="space-y-2">
                            {relatedPosts.map((p) => (
                                <li key={p.slug}><Link to={`/blog/${p.slug}`} className="text-[#F97316] hover:underline font-medium">{p.title} →</Link></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <CtaBlock title={`Let's talk about your ${ind.audience.toLowerCase().slice(0, -1)} project`} />
        </>
    );
}
