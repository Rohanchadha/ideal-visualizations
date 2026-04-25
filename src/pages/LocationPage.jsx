import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { LOCATION_BY_SLUG } from '../content/locations';
import { SERVICES } from '../content/services';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function LocationPage() {
    const { slug } = useParams();
    const loc = LOCATION_BY_SLUG[slug];
    if (!loc) return <Navigate to="/" replace />;

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Locations', path: '/' },
        { name: loc.city, path: `/locations/${loc.slug}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/locations/${loc.slug}#business`,
        name: `Ideal Visualizations — ${loc.city}`,
        description: loc.description,
        url: `${SITE_URL}/locations/${loc.slug}`,
        parentOrganization: { '@id': ORG_ID },
        areaServed: { '@type': 'City', name: loc.city },
        address: loc.slug === 'amritsar' ? {
            '@type': 'PostalAddress',
            addressLocality: 'Amritsar',
            addressRegion: 'Punjab',
            addressCountry: 'IN',
        } : undefined,
        telephone: '+91-9646724313',
        email: 'idealvisualization@gmail.com',
    };

    return (
        <>
            <Seo title={loc.title} description={loc.description} path={`/locations/${loc.slug}`} jsonLd={jsonLd} breadcrumb={breadcrumb} />
            <PageHero eyebrow={`Serving ${loc.city}, ${loc.country}`} title={loc.h1} subtitle={loc.hook} breadcrumb={breadcrumb} />

            <div className="px-6 md:px-12">
                <div className="max-w-5xl mx-auto pb-12">
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{loc.intro}</p>
                </div>

                <div className="max-w-5xl mx-auto pb-16 grid md:grid-cols-2 gap-4">
                    <div className="bg-[#52525B] text-white rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-wider opacity-70 mb-2">Availability in {loc.city}</h2>
                        <p className="text-sm leading-relaxed">{loc.availability}</p>
                    </div>
                    <div className="bg-[#F97316] text-white rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-wider opacity-90 mb-2">Pricing for {loc.city} clients</h2>
                        <p className="text-sm leading-relaxed">{loc.pricingNote}</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Services we deliver to {loc.city}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {SERVICES.map((s) => (
                            <Link key={s.slug} to={`/services/${s.slug}`} className="block bg-white border border-gray-200 hover:border-[#F97316] rounded-2xl p-4 transition-colors">
                                <h3 className="font-bold text-[#52525B] text-sm">{s.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-4 tracking-tight">Recent {loc.city} projects</h2>
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                        <p className="text-[#6B7280] italic">{loc.portfolioNote}</p>
                    </div>
                </div>

                {loc.showMap && (
                    <div className="max-w-5xl mx-auto pb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-4 tracking-tight">Visit us in Amritsar</h2>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200">
                            <iframe
                                title="Ideal Visualizations Amritsar"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54802.0!2d74.8723!3d31.6340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2zQW1yaXRzYXI!5e0!3m2!1sen!2sin!4v1700000000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                )}
            </div>

            <CtaBlock title={`Talk to us about your ${loc.city} project`} subtitle="WhatsApp, email or callback — whichever works for your time zone." />
        </>
    );
}
