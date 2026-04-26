import React from 'react';
import { Phone, Mail, MapPinned, MessageCircle, Instagram } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { CONTACT, whatsappLink } from '../config/site';
import { SITE_URL, ORG_ID } from '../config/seo';
import { useUI } from '../context/UIContext';

export default function ContactPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
    ];
    const { openCallback } = useUI();
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${SITE_URL}/contact`,
        about: { '@id': ORG_ID },
    };
    return (
        <>
            <Seo
                title="Contact Ideal Visualizations | WhatsApp, Email & Callback"
                description="Get in touch with Ideal Visualizations. WhatsApp +91 96467 24313, email danish@slateconcepts.com, or request a callback. Studio in Amritsar."
                path="/contact"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Get in touch"
                title="Let's talk about"
                italic="your project"
                subtitle="Pick the channel that suits you — WhatsApp for quick chats, email for detailed briefs, or a callback at your preferred time."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group bg-[#25D366] hover:bg-[#1FB855] text-white rounded-3xl p-8 transition-colors">
                        <MessageCircle className="w-10 h-10 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Talk on WhatsApp</h2>
                        <p className="opacity-90 mb-2">Fastest response — typically within an hour.</p>
                        <p className="font-semibold">{CONTACT.phone}</p>
                    </a>
                    <a href={`mailto:${CONTACT.email}`} className="group bg-[#52525B] hover:bg-[#111111] text-white rounded-3xl p-8 transition-colors">
                        <Mail className="w-10 h-10 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Email Us</h2>
                        <p className="opacity-80 mb-2">Best for detailed briefs and file attachments.</p>
                        <p className="font-semibold break-all">{CONTACT.email}</p>
                    </a>
                    <button onClick={openCallback} className="text-left bg-[#F97316] hover:bg-[#EA580C] text-white rounded-3xl p-8 transition-colors">
                        <Phone className="w-10 h-10 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Request a callback</h2>
                        <p className="opacity-90">Pick a time that works for your time zone — we'll call.</p>
                    </button>
                    <div className="bg-white border border-gray-200 rounded-3xl p-8">
                        <MapPinned className="w-10 h-10 text-[#F97316] mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-[#52525B]">Visit us</h2>
                        <p className="text-[#6B7280] mb-2">Walk-in consultations at our Amritsar HQ.</p>
                        <p className="text-[#52525B] font-semibold">Amritsar, Punjab, India</p>
                        <div className="flex gap-3 mt-4">
                            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#F97316] hover:text-white flex items-center justify-center transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={CONTACT.behance} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#F97316] hover:text-white flex items-center justify-center font-bold transition-colors">Bē</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-12 text-center">
                    <p className="text-[#6B7280] text-sm md:text-base">
                        Working hours: Mon–Sat, 10am–7pm IST. WhatsApp messages outside these hours are answered first thing the next morning.
                    </p>
                </div>
            </div>
        </>
    );
}
