import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import GalleryGrid from '../components/GalleryGrid';
import { LOCATION_BY_SLUG } from '../content/locations';
import { SERVICES } from '../content/services';
import { isPreviewMode, onlyPublished } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';
import { imagesForLocation } from '../config/galleryHelpers';
import { CONTACT } from '../config/site';

export default function LocationPage() {
    const { slug } = useParams();
    const loc = LOCATION_BY_SLUG[slug];
    if (!loc) return <NotFoundPage />;
    if (loc.draft && !isPreviewMode()) return <NotFoundPage />;

    const locImages = imagesForLocation(loc.slug, 6);
    const localStudio = loc.slug === 'amritsar';
    const visibleServices = onlyPublished(SERVICES).filter((service) => localStudio || service.category === '3D Visualization');

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Locations', path: '/' },
        { name: loc.city, path: `/locations/${loc.slug}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${SITE_URL}/locations/${loc.slug}#page`,
        name: loc.h1,
        description: loc.description,
        url: `${SITE_URL}/locations/${loc.slug}`,
        about: { '@id': ORG_ID },
        mainEntity: {
            '@type': 'Service',
            name: localStudio ? 'Architectural planning, interiors and turnkey construction in Amritsar' : `3D visualization for ${loc.city} clients`,
            provider: { '@id': ORG_ID },
            areaServed: { '@type': 'City', name: loc.city },
        },
    };

    return (
        <>
            <Seo title={loc.title} description={loc.description} path={`/locations/${loc.slug}`} jsonLd={jsonLd} breadcrumb={breadcrumb} noIndex={loc.draft} />
            <PageHero eyebrow={`Serving ${loc.city}, ${loc.country}`} title={loc.h1} subtitle={loc.hook} breadcrumb={breadcrumb} />

            <div className="px-6 md:px-12">
                <div className="max-w-5xl mx-auto pb-12">
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{loc.intro}</p>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <div className="bg-[#52525B] text-white rounded-2xl p-6">
                        <h2 className="text-xs uppercase tracking-wider opacity-70 mb-2">Availability in {loc.city}</h2>
                        <p className="text-sm leading-relaxed">{loc.availability}</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Services we deliver to {loc.city}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visibleServices.map((s) => (
                            <Link key={s.slug} to={`/services/${s.slug}`} className="block bg-white border border-gray-200 hover:border-[#F97316] rounded-2xl p-4 transition-colors">
                                <h3 className="font-bold text-[#52525B] text-sm">{s.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {locImages.length > 0 && (
                    <div className="max-w-7xl mx-auto pb-16">
                        <div className="flex items-baseline justify-between mb-5">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] tracking-tight">Recent {loc.city} projects</h2>
                            <Link to="/portfolio" className="text-sm text-[#F97316] hover:underline font-semibold whitespace-nowrap">
                                See all →
                            </Link>
                        </div>
                        <GalleryGrid items={locImages} variant="image" />
                    </div>
                )}

                {loc.showMap && (
                    <div className="max-w-5xl mx-auto pb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-4 tracking-tight">Visit us in Amritsar</h2>
                        <address className="not-italic text-[#6B7280] mb-3">{CONTACT.address}</address>
                        <a href={CONTACT.mapsLocation} target="_blank" rel="noopener noreferrer" className="inline-block text-[#F97316] hover:underline mb-5">Get directions to our studio</a>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200">
                            <iframe
                                title="Slate Concepts Amritsar"
                                src={`https://www.google.com/maps?${new URLSearchParams({ q: `${CONTACT.plusCode}, India`, output: 'embed', z: '16' })}`}
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
