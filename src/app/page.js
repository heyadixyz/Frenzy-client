'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FAQ from '../components/faq';
import AboutUs from '../components/about';
import Community from '../components/Community';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <AboutUs />
        <Community />
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}
