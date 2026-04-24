import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { UIProvider } from './context/UIContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

function App() {
  const location = useLocation();
  const isGallery = location.pathname.startsWith('/gallery');

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

        {!isGallery && <Navbar />}

        <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </Suspense>

        {!isGallery && <Footer />}
        {!isGallery && <FloatingWhatsApp />}
      </div>
    </UIProvider>
  );
}

export default App;
