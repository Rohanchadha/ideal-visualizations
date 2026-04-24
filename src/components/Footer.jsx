import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPinned, MessageCircle, PhoneCall, Instagram } from 'lucide-react';
import { CONTACT, whatsappLink } from '../config/site';
import { useUI } from '../context/UIContext';

export default function Footer() {
    const { openCallback } = useUI();

    return (
        <footer id="contact" className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 rounded-t-[4rem] relative z-20 mt-[-2rem] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(/3D-Images/2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Top CTA Band */}
            <div className="max-w-7xl mx-auto relative z-10 mb-16">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            Have a project in mind?
                        </h3>
                        <p className="text-gray-400 text-base md:text-lg">
                            Let's bring your vision to life. Reach out through the channel you prefer — we typically respond within an hour.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <a
                            href={whatsappLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="magnetic-btn bg-[#25D366] hover:bg-[#1FB855] text-white px-6 py-3.5 rounded-full font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <MessageCircle className="w-5 h-5" /> Talk on WhatsApp
                        </a>
                        <button
                            onClick={openCallback}
                            className="magnetic-btn bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3.5 rounded-full font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <PhoneCall className="w-5 h-5" /> Request a Callback
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
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
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Contact Details</h4>
                    <ul className="space-y-5 text-gray-400">
                        <li>
                            <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-start gap-3 hover:text-[#F97316] transition-colors group">
                                <Phone className="w-5 h-5 shrink-0 group-hover:-rotate-12 transition-transform text-[#F97316]" />
                                <span className="leading-snug break-all">{CONTACT.phone}</span>
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 hover:text-[#F97316] transition-colors group">
                                <Mail className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform text-[#F97316]" />
                                <span className="leading-snug break-all">{CONTACT.email}</span>
                            </a>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPinned className="w-5 h-5 shrink-0 text-[#F97316]" />
                            <span className="leading-snug text-gray-400">
                                Amritsar Headquarters<br />
                                Punjab, India
                            </span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Navigation</h4>
                    <ul className="space-y-3 text-gray-400">
                        <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                        <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                        <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                        <li>
                            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                        </li>
                        <li>
                            <a href={CONTACT.behance} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Behance</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Ideal Visualizations. All rights reserved.</p>
                <p className="flex items-center gap-1 font-mono">Powered by Design</p>
            </div>
        </footer>
    );
}
