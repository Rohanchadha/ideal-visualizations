import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';
import { CONTACT } from '../config/site';

// Shown on the page and in metadata. Update when the policy text changes.
const LAST_UPDATED = 'October 2026';

// Privacy contact address. Kept separate from CONTACT.email so the studio can
// route privacy requests to a different inbox if it wants to.
const PRIVACY_EMAIL = 'info@slateconcepts.com';

export default function PrivacyPolicyPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy — Slate Concepts',
        url: `${SITE_URL}/privacy-policy`,
        about: { '@id': ORG_ID },
    };

    return (
        <>
            <Seo
                title="Privacy Policy | Slate Concepts"
                description="How Slate Concepts collects, uses and protects the personal information you share through our website, Meta lead forms, WhatsApp and other enquiry channels."
                path="/privacy-policy"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Legal"
                title="Privacy"
                italic="Policy"
                subtitle={`Last updated: ${LAST_UPDATED}`}
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-16">
                <div className="max-w-3xl mx-auto">
                    <Prose>
                        <p>
                            Slate Concepts ("SLATE", "we", "us", or "our") respects your privacy and is
                            committed to protecting the personal information you share with us.
                        </p>

                        <h2>Information We Collect</h2>
                        <p>
                            When you submit an enquiry through our website, Meta lead form, WhatsApp, or other
                            channels, we may collect information such as:
                        </p>
                        <ul>
                            <li>Name</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                            <li>Property/project location</li>
                            <li>Project type</li>
                            <li>Approximate project budget</li>
                            <li>Other information you voluntarily provide about your project</li>
                        </ul>

                        <h2>How We Use Your Information</h2>
                        <p>We use this information to:</p>
                        <ul>
                            <li>Respond to your enquiry</li>
                            <li>Understand your interior design, renovation, construction or turnkey requirements</li>
                            <li>Contact you regarding your project</li>
                            <li>Schedule consultations or site visits</li>
                            <li>Provide information about our services</li>
                        </ul>

                        <h2>Sharing of Information</h2>
                        <p>
                            We may use service providers and technology platforms to help us manage enquiries
                            and communicate with you. We do not sell your personal information.
                        </p>

                        <h2>Data Security</h2>
                        <p>
                            We take reasonable measures to protect the information you provide from
                            unauthorized access, misuse or disclosure.
                        </p>

                        <h2>Your Choices</h2>
                        <p>
                            You may contact us to request information about the personal data we hold about
                            you or to request that we stop contacting you for marketing purposes.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            <strong>Slate Concepts</strong><br />
                            Email: <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a><br />
                            Phone: <a href={`tel:+${CONTACT.phoneRaw}`}>{CONTACT.phone}</a>
                        </p>

                        <p>
                            For anything else, see our <Link to="/contact">contact page</Link>.
                        </p>
                    </Prose>
                </div>
            </div>
        </>
    );
}
