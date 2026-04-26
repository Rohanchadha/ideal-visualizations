import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPinned, MessageCircle, PhoneCall, Instagram } from 'lucide-react';
import { CONTACT, whatsappLink } from '../config/site';
import { useUI } from '../context/UIContext';
import { SERVICES } from '../content/services';
import { LOCATIONS } from '../content/locations';
import { onlyPublished } from '../config/visibility';
import { trackEvent } from './Analytics';

export default function Footer() {
    const { openCallback } = useUI();

    return (
        <footer id="contact" className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 rounded-t-[4rem] relative z-20 mt-[-2rem] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(/3D-Images/2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Top CTA Band */}
            <div className="max-w-7xl mx-auto relative z-10 mb-16">
                <div className="bg-white/[0.04] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
                    <div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-3">
                            Have a project in mind?
                        </h3>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                            Reach out through the channel you prefer — we typically respond within an hour.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 w-full">
                        <a
                            href={whatsappLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('cta_whatsapp_click', { location: 'footer' })}
                            className="bg-[#25D366] hover:bg-[#1FB855] text-white px-5 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" /> WhatsApp
                        </a>
                        <button
                            onClick={() => { trackEvent('cta_callback_click', { location: 'footer' }); openCallback(); }}
                            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                        >
                            <PhoneCall className="w-5 h-5" /> Callback
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                <div className="lg:col-span-2">
                    <span className="font-bold text-3xl tracking-tight text-white mb-6 block">Ideal Visualizations</span>
                    <p className="text-gray-400 max-w-sm text-balance text-lg leading-relaxed mb-8">
                        Precision and longevity in architectural visualization, bringing your most ambitious concepts to digital life.
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href={CONTACT.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#F97316] border border-white/10 flex items-center justify-center transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href={CONTACT.behance}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#F97316] border border-white/10 flex items-center justify-center transition-colors text-sm font-bold"
                            aria-label="Behance"
                        >
                            Bē
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Services</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        {onlyPublished(SERVICES).slice(0, 7).map((s) => (
                            <li key={s.slug}><Link to={`/services/${s.slug}`} className="hover:text-white">{s.name}</Link></li>
                        ))}
                        <li><Link to="/services" className="hover:text-[#F97316] font-semibold">All Services →</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Locations</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        {onlyPublished(LOCATIONS).map((l) => (
                            <li key={l.slug}>
                                <Link to={`/locations/${l.slug}`} className="hover:text-white">
                                    {l.city}{l.slug === 'amritsar' ? ' (HQ)' : ''}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Resources</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><Link to="/portfolio" className="hover:text-white">Portfolio</Link></li>
                        <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
                        <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                        <li><Link to="/process" className="hover:text-white">Our Process</Link></li>
                        <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                        <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                        <li><Link to="/about" className="hover:text-white">About</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 mb-12">
                <div className="grid sm:grid-cols-3 gap-4 text-gray-400 text-sm">
                    <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-3 hover:text-[#F97316] transition-colors">
                        <Phone className="w-5 h-5 text-[#F97316]" />
                        {CONTACT.phone}
                    </a>
                    <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-[#F97316] transition-colors break-all">
                        <Mail className="w-5 h-5 text-[#F97316] shrink-0" />
                        {CONTACT.email}
                    </a>
                    <span className="flex items-center gap-3">
                        <MapPinned className="w-5 h-5 text-[#F97316] shrink-0" />
                        Amritsar, Punjab, India
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Ideal Visualizations. All rights reserved.</p>
                <p className="flex items-center gap-1 font-mono">Powered by Design</p>
            </div>
        </footer>
    );
}
