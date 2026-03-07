import React from 'react';
import { Phone, Mail, MapPinned } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contact" className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 rounded-t-[4rem] relative z-20 mt-[-2rem] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(/3D-Images/2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                <div className="lg:col-span-2">
                    <span className="font-bold text-3xl tracking-tight text-white mb-6 block">Ideal Visualizations</span>
                    <p className="text-gray-400 max-w-sm text-balance text-lg leading-relaxed mb-8">
                        Precision longevity in architectural visualization, bringing your most ambitious concepts to digital life.
                    </p>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        System Operational
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider text-sm">Contact Details</h4>
                    <ul className="space-y-6 text-gray-400">
                        <li>
                            <a href="tel:+911234567890" className="flex items-start gap-3 hover:text-[#F97316] transition-colors group">
                                <Phone className="w-5 h-5 shrink-0 group-hover:-rotate-12 transition-transform text-[#F97316]" />
                                <span className="leading-snug">+91 123 456 7890</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@idealvisualizations.com" className="flex items-start gap-3 hover:text-[#F97316] transition-colors group">
                                <Mail className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform text-[#F97316]" />
                                <span className="leading-snug">hello@idealvisualizations.com</span>
                            </a>
                        </li>
                        <li className="flex items-start gap-3 group group-hover:text-white cursor-default">
                            <MapPinned className="w-5 h-5 shrink-0 text-[#F97316]" />
                            <span className="leading-snug text-gray-400">
                                Amritsar Headquarters<br />
                                Punjab, India
                            </span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider text-sm">Legal & Navigation</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                        <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Ideal Visualizations. All rights reserved.</p>
                <p className="flex items-center gap-1 font-mono">
                    Powered by Design
                </p>
            </div>
        </footer>
    );
}
