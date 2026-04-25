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
                        <li><Link to="/services/exterior-3d-rendering" className="hover:text-white">Exterior Rendering</Link></li>
                        <li><Link to="/services/interior-3d-rendering" className="hover:text-white">Interior Rendering</Link></li>
                        <li><Link to="/services/3d-walkthrough-animation" className="hover:text-white">3D Walkthroughs</Link></li>
                        <li><Link to="/services/360-virtual-tour" className="hover:text-white">360° Tours</Link></li>
                        <li><Link to="/services/architecture-planning" className="hover:text-white">Architecture Planning</Link></li>
                        <li><Link to="/services/interior-design" className="hover:text-white">Interior Design</Link></li>
                        <li><Link to="/services/turnkey-construction" className="hover:text-white">Turnkey Construction</Link></li>
                        <li><Link to="/services" className="hover:text-[#F97316] font-semibold">All Services →</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">Locations</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><Link to="/locations/amritsar" className="hover:text-white">Amritsar (HQ)</Link></li>
                        <li><Link to="/locations/chandigarh" className="hover:text-white">Chandigarh</Link></li>
                        <li><Link to="/locations/delhi-ncr" className="hover:text-white">Delhi-NCR</Link></li>
                        <li><Link to="/locations/mumbai" className="hover:text-white">Mumbai</Link></li>
                        <li><Link to="/locations/dubai" className="hover:text-white">Dubai</Link></li>
                        <li><Link to="/locations/toronto" className="hover:text-white">Toronto</Link></li>
                        <li><Link to="/locations/new-york" className="hover:text-white">New York</Link></li>
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
