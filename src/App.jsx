import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import { UIProvider } from './context/UIContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ServicesHub = lazy(() => import('./pages/ServicesHub'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const IndustryPage = lazy(() => import('./pages/IndustryPage'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

function App() {
  return (
    <UIProvider>
      <div className="relative min-h-screen">
        {/* Global Noise Overlay */}
        <div className="noise-overlay pointer-events-none z-50 fixed inset-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-[0.4]">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <Navbar />
        <ScrollToTop />
        <Analytics />

        <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<GalleryPage />} />
            <Route path="/gallery" element={<Navigate to="/portfolio" replace />} />
            <Route path="/portfolio/:slug" element={<Navigate to="/portfolio" replace />} />
            <Route path="/services" element={<ServicesHub />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/industries/:slug" element={<IndustryPage />} />
            <Route path="/locations/:slug" element={<LocationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </Suspense>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </UIProvider>
  );
}

export default App;
