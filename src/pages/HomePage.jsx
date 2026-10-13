import React from 'react';
import Hero from '../components/Hero';
import Seo from '../components/Seo';
import HomeProjectGuide from '../components/HomeProjectGuide';
import WhyChooseUs from '../components/WhyChooseUs';
import VideoShowcase from '../components/VideoShowcase';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import ConstructionPortfolio from '../components/ConstructionPortfolio';
import About from '../components/About';
import Locations from '../components/Locations';
import { HOME_TITLE, HOME_DESCRIPTION } from '../config/seo';

export default function HomePage() {
    return (
        <>
            <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
            <Hero />
            <HomeProjectGuide />
            <Services />
            <WhyChooseUs />
            <ConstructionPortfolio />
            <Portfolio />
            <About />
            <VideoShowcase />
            <Locations />
        </>
    );
}
