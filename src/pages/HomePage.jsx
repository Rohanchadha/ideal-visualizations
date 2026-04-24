import React from 'react';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import VideoShowcase from '../components/VideoShowcase';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Locations from '../components/Locations';

export default function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <WhyChooseUs />
            <Portfolio />
            <VideoShowcase />
            <Locations />
        </>
    );
}
