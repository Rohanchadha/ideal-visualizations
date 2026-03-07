import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import VideoShowcase from './components/VideoShowcase';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Locations from './components/Locations';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
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
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      <VideoShowcase />
      <Locations />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
