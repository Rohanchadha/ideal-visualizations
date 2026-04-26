import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, PhoneCall } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { whatsappLink } from '../config/site';
import { trackEvent } from './Analytics';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { openCallback } = useUI();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
        );
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleAnchor = (e, id) => {
        if (location.pathname !== '/') {
            e.preventDefault();
            navigate('/');
            setTimeout(() => {
                document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
        setMenuOpen(false);
    };

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-3 md:top-6 left-0 right-0 mx-auto z-40 transition-all duration-500 rounded-full px-3 md:px-6 py-2 md:py-3 flex items-center justify-between gap-3 md:gap-8 w-[96%] sm:w-[94%] max-w-6xl ${scrolled
                    ? 'bg-[#52525B]/95 backdrop-blur-xl shadow-xl text-white'
                    : 'bg-black/30 backdrop-blur-md text-white'
                    }`}
            >
                <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
                    <img src="/logo.png" alt="Ideal Visualizations Logo" className="h-6 md:h-8 w-auto rounded-sm bg-white/90 p-0.5 md:p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <span className="font-bold tracking-tight text-sm md:text-lg whitespace-nowrap">Ideal Visualizations</span>
                </Link>

                <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="hover:-translate-y-0.5 transition-transform"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link to="/gallery" className="hover:-translate-y-0.5 transition-transform">Gallery</Link>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { trackEvent('cta_callback_click', { location: 'navbar' }); openCallback(); }}
                        className="hidden sm:inline-flex magnetic-btn shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 md:px-4 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors items-center gap-2"
                    >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Request a Callback</span>
                        <span className="md:hidden">Callback</span>
                    </button>
                    <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('cta_whatsapp_click', { location: 'navbar' })}
                        className="magnetic-btn shrink-0 bg-[#25D366] hover:bg-[#1FB855] text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md whitespace-nowrap inline-flex items-center gap-2"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Talk on WhatsApp</span>
                        <span className="md:hidden">WhatsApp</span>
                    </a>
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        className="lg:hidden p-2 text-white"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="lg:hidden fixed top-[68px] left-0 right-0 mx-auto z-40 w-[96%] sm:w-[94%] max-w-6xl bg-[#1a1a1a]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-5 text-white">
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="px-3 py-3 rounded-xl hover:bg-white/10 font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            to="/gallery"
                            className="px-3 py-3 rounded-xl hover:bg-white/10 font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Gallery
                        </Link>
                        <button
                            onClick={() => { trackEvent('cta_callback_click', { location: 'navbar_mobile' }); openCallback(); setMenuOpen(false); }}
                            className="mt-3 w-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2"
                        >
                            <PhoneCall className="w-4 h-4" /> Request a Callback
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
