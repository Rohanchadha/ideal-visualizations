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
                className={`fixed top-3 md:top-6 left-0 right-0 mx-auto z-40 transition-all duration-500 rounded-full px-3 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-6 w-[96%] sm:w-[94%] max-w-6xl ${scrolled
                    ? 'bg-[#52525B]/95 backdrop-blur-xl shadow-xl text-white'
                    : 'bg-black/30 backdrop-blur-md text-white'
                    }`}
            >
                <Link
                    to="/"
                    className="flex items-center gap-3 md:gap-4 shrink-0 group mr-auto"
                    aria-label="SLATE Concept Studios — Home"
                >
                    <img
                        src="/brand/slate-mark-white.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-5 md:h-6 w-auto select-none transition-transform duration-300 group-hover:scale-[1.05]"
                        draggable="false"
                    />
                    <span className="font-semibold tracking-[0.2em] text-base md:text-lg text-white select-none whitespace-nowrap">
                        SLATE CONCEPTS
                    </span>
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
                        aria-label="Talk on WhatsApp"
                        className="magnetic-btn shrink-0 bg-[#25D366] hover:bg-[#1FB855] text-white shadow-md whitespace-nowrap hidden sm:inline-flex items-center justify-center gap-2 rounded-full p-2 md:px-5 md:py-2.5 md:text-sm md:font-semibold"
                    >
                        <MessageCircle className="w-4 h-4 md:w-3.5 md:h-3.5" />
                        <span className="hidden md:inline">Talk on WhatsApp</span>
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
