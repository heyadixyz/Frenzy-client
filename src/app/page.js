'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FAQ from '../components/faq';
import AboutUs from '../components/about';
import Community from '../components/Community';
import Team from '../components/team'; 
import Testimonial from '../components/testimonial';
import Partners from '../components/partners';
import Sponsors from '../components/sponsor';
import { AnimatedBackground } from '../components/animated-background';

export default function Home() {
  return (
    <AnimatedBackground 
      primaryColor="rgba(67, 19, 87, 0.35)" 
      secondaryColor="rgba(49, 47, 147, 0.35)"
      className="min-h-screen"
    >
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-grow z-10">
          <AboutUs />
          <Team />
          <Testimonial />
          <Community />
          <Partners />
          <Sponsors />
          <FAQ />
        </div>
        
        <Footer />
      </div>
    </AnimatedBackground>
  );
}