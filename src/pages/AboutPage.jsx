import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';
import { CONTACT } from '../config/site';

const mapDestination = `${CONTACT.plusCode}, India`;
const mapEmbedUrl = `https://www.google.com/maps?${new URLSearchParams({ q: mapDestination, output: 'embed', z: '16' })}`;
const directionsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: mapDestination })}`;

export default function AboutPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url: `${SITE_URL}/about`,
        about: { '@id': ORG_ID },
        mainEntity: {
            '@type': 'Person',
            name: 'Danish Seth',
            jobTitle: 'Principal Architect',
            hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                name: 'B.Arch',
            },
            worksFor: { '@id': ORG_ID },
        },
    };
    return (
        <>
            <Seo
                title={`About ${CONTACT.businessName} | Home Construction & Interiors in Amritsar`}
                description={`Meet Danish Seth and Mansi Seth at ${CONTACT.businessName} in Amritsar. Turnkey home construction, renovation, interiors and planning, with Ludhiana as our next priority market.`}
                path="/about"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Our story"
                title="A studio built on"
                italic="precision and longevity"
                subtitle="Turnkey home construction in Amritsar comes first, followed by Ludhiana. We also support homeowners with renovation, interiors and planning, with visualization as part of the design process."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-3xl mx-auto">
                    <Prose>
                        <h2>Our focus</h2>
                        <p>{CONTACT.businessName} is based in Amritsar. Our priority is turnkey and home construction, followed by renovation and interiors. We help homeowners bring planning, design and execution together, with the responsibilities and deliverables agreed for each project.</p>

                        <h2>Our team</h2>
                        <p><strong>Danish Seth</strong> is our Principal Architect, with a B.Arch qualification and registration with the Council of Architecture (CoA). He has five years of full-time experience across architecture, interiors and 3D visualization.</p>
                        <p><strong>Mansi Seth</strong> works across interiors and marketing.</p>

                        <h2>What makes us different</h2>
                        <ul>
                            <li><strong>Full-stack studio.</strong> We don't only render. We also plan, design and build. That means our renders carry a working architect's eye for what is buildable, what costs money and what reads well in the field.</li>
                            <li><strong>Accountable team, not freelancers.</strong> Every project has a named lead. No rotating cast. No mid-project handoffs.</li>
                            <li><strong>India-base pricing, international-grade communication.</strong> Same-day WhatsApp response. English-language working environment. Time-zone overlap with Asia, Europe, the Middle East and the East Coast of North America.</li>
                            <li><strong>NDA-first.</strong> Every project starts with your NDA signed. Your unbuilt work stays confidential.</li>
                        </ul>

                        <h2>Software & tools</h2>
                        <p>SketchUp and AutoCAD for modelling and planning. Lumion for photoreal rendering. Adobe Photoshop for post-production and finishing.</p>

                        <h2>Where we work from</h2>
                        <p>The studio is based in <strong>Amritsar</strong>. Residential architecture, interiors and turnkey work is focused on Amritsar, Ludhiana, Chandigarh and Delhi, with execution availability confirmed per site and scope. Meetings and site visits are arranged through the enquiry conversation. Visualization work is delivered remotely worldwide.</p>

                        <h2>Where to next</h2>
                        <p>Browse our <Link to="/services">services</Link>, see <Link to="/portfolio">our portfolio</Link>, read the <Link to="/blog">blog</Link>, or jump straight to the <Link to="/contact">contact page</Link>.</p>
                    </Prose>
                </div>
            </div>

            <CtaBlock />
            <section id="studio-location" aria-labelledby="studio-location-heading" className="bg-[#FAFAFA] px-6 py-14 md:px-12 md:py-20">
                <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center md:gap-12">
                    <div className="min-w-0">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#F97316]">Amritsar Studio</p>
                        <h2 id="studio-location-heading" className="text-3xl font-bold text-[#52525B] md:text-4xl">Visit our studio</h2>
                        <address className="mt-5 max-w-md text-base not-italic leading-relaxed text-[#6B7280]">
                            {CONTACT.address}
                        </address>
                        <p className="mt-3 text-sm text-[#6B7280]">Plus code: {CONTACT.plusCode}</p>
                        <p className="mt-3 text-sm text-[#6B7280]">{CONTACT.workingHours}. {CONTACT.visitPolicy}</p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <a href={CONTACT.mapsLocation} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#52525B]/30 px-5 py-3 text-sm font-semibold text-[#52525B] transition-colors hover:bg-[#E4E4E7]">
                                <MapPin className="h-4 w-4" aria-hidden="true" /> Google Maps
                            </a>
                            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#F97316] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EA580C]">
                                <Navigation className="h-4 w-4" aria-hidden="true" /> Get Directions
                            </a>
                        </div>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#E4E4E7] md:aspect-[16/10]">
                        <iframe
                            title={`${CONTACT.businessName} location in Amritsar`}
                            src={mapEmbedUrl}
                            width="640"
                            height="400"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="h-full w-full border-0"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
