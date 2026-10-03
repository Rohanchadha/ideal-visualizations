import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';

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
            name: 'Danish',
            jobTitle: 'Founder & Principal',
            worksFor: { '@id': ORG_ID },
        },
    };
    return (
        <>
            <Seo
                title="About SLATE Concept Studios | Architecture, Interiors & Visualization"
                description="The story behind SLATE Concept Studios — founded by Danish in Amritsar. Architecture, interiors, turnkey execution and 3D visualization for clients in India and abroad."
                path="/about"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Our story"
                title="A studio built on"
                italic="precision and longevity"
                subtitle="Founded in Amritsar by Danish. Architecture, interiors and turnkey execution, with visualization work for clients in India and abroad. One studio, one accountable team."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-3xl mx-auto">
                    <Prose>
                        <h2>How we got here</h2>
                        <p>SLATE Concept Studios was founded by Danish in Amritsar with a simple thesis: architects, designers and developers deserve photoreal visualisations that match their ambition — without paying global studio prices, missing deadlines or being passed between freelancers.</p>
                        <p>Over 10+ years, that thesis has played out across a wide range of work. We have rendered luxury villas in Chandigarh, off-plan towers in Dubai, condo developments in Toronto, restaurant fitouts in Amritsar and commercial pitches in New York. Each project has tightened the pipeline, deepened the team and sharpened the eye.</p>

                        <h2>What makes us different</h2>
                        <ul>
                            <li><strong>Full-stack studio.</strong> We don't only render. We also plan, design and build. That means our renders carry a working architect's eye for what is buildable, what costs money and what reads well in the field.</li>
                            <li><strong>Accountable team, not freelancers.</strong> Every project has a named lead. No rotating cast. No mid-project handoffs.</li>
                            <li><strong>India-base pricing, international-grade communication.</strong> Same-day WhatsApp response. English-language working environment. Time-zone overlap with Asia, Europe, the Middle East and the East Coast of North America.</li>
                            <li><strong>NDA-first.</strong> Every project starts with your NDA signed. Your unbuilt work stays confidential.</li>
                        </ul>

                        <h2>Software & tools</h2>
                        <p>SketchUp and AutoCAD for modelling and planning. Lumion for photoreal rendering and fast turnarounds. Adobe Photoshop for post-production and finishing. A focused toolkit, refined over 10+ years of practice.</p>

                        <h2>Where we work from</h2>
                        <p>The studio is based in <strong>Amritsar</strong>. Residential architecture, interiors and turnkey work is focused on Amritsar, Ludhiana, Chandigarh and Delhi, with execution availability confirmed per site and scope. Meetings and site visits are arranged through the enquiry conversation. Visualization work is delivered remotely worldwide.</p>

                        <h2>Where to next</h2>
                        <p>Browse our <Link to="/services">services</Link>, see <Link to="/portfolio">our portfolio</Link>, read the <Link to="/blog">blog</Link>, or jump straight to the <Link to="/contact">contact page</Link>.</p>
                    </Prose>
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
