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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
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
  );
}
