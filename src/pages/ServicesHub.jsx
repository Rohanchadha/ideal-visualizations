import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { SERVICE_CATEGORIES, SERVICES } from '../content/services';
import { INDUSTRIES } from '../content/industries';
import { onlyPublished } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function ServicesHub() {
    const visibleServices = onlyPublished(SERVICES);
    const visibleIndustries = onlyPublished(INDUSTRIES);
    const visibleCategories = SERVICE_CATEGORIES
        .map((c) => ({ ...c, services: onlyPublished(c.services) }))
        .filter((c) => c.services.length > 0);

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Services — Ideal Visualizations',
        url: `${SITE_URL}/services`,
        about: { '@id': ORG_ID },
        hasPart: visibleServices.map((s) => ({
            '@type': 'Service',
            name: s.name,
            url: `${SITE_URL}/services/${s.slug}`,
            description: s.description,
        })),
    };
    return (
        <>
            <Seo
                title="Services | Ideal Visualizations — 3D Rendering, Walkthroughs, Turnkey"
                description="Eight services across 3D visualization (exterior, interior, walkthrough, 360°) and architecture & construction (planning, elevation, interior design, turnkey)."
                path="/services"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="What we do"
                title="Services"
                italic="end to end"
                subtitle="From a single render to a complete turnkey building. Eight services, one accountable team, one studio."
                breadcrumb={breadcrumb}
            />
            <div className="px-6 md:px-12 pb-16">
                <div className="max-w-6xl mx-auto space-y-16">
                    {visibleCategories.map((cat) => (
                        <section key={cat.name}>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">{cat.name}</h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                {cat.services.map((s) => (
                                    <Link
                                        key={s.slug}
                                        to={`/services/${s.slug}`}
                                        className="group block bg-white border border-gray-200 hover:border-[#F97316] rounded-3xl p-6 md:p-8 transition-all hover:shadow-xl"
                                    >
                                        <h3 className="text-xl md:text-2xl font-bold text-[#52525B] mb-2 group-hover:text-[#F97316] transition-colors">{s.name}</h3>
                                        <p className="text-[#6B7280] text-sm md:text-base leading-relaxed mb-4">{s.description}</p>
                                        <span className="inline-flex items-center gap-1 text-[#F97316] font-semibold text-sm">
                                            Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}

                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">For your industry</h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            {visibleIndustries.map((i) => (
                                <Link key={i.slug} to={`/industries/${i.slug}`} className="block bg-[#52525B] hover:bg-[#F97316] text-white rounded-3xl p-6 transition-colors">
                                    <h3 className="text-lg font-bold mb-1">{i.audience}</h3>
                                    <p className="text-white/80 text-sm">{i.subhead}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="grid sm:grid-cols-3 gap-4">
                        <Link to="/portfolio" className="text-center bg-gray-100 hover:bg-gray-200 rounded-2xl p-6 font-semibold text-[#52525B]">See portfolio →</Link>
                        <Link to="/process" className="text-center bg-gray-100 hover:bg-gray-200 rounded-2xl p-6 font-semibold text-[#52525B]">Our process →</Link>
                        <Link to="/pricing" className="text-center bg-gray-100 hover:bg-gray-200 rounded-2xl p-6 font-semibold text-[#52525B]">Pricing →</Link>
                    </section>
                </div>
            </div>
            <CtaBlock />
        </>
    );
}
