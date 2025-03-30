import AboutUs from "@/components/about";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";
import { Timeline } from "@/components/time-line";
import AnimatedBackground from "@/components/animated-background";
import Community from "@/components/Community";
import Sponsors from "@/components/sponsor";
import Testimonial from "@/components/testimonial";
import FAQ from "@/components/faq";
import Partners from "@/components/partners";
import Glimpses from "@/components/gallery";

export default function Home() {
  return (
    <AnimatedBackground>
        <Navbar/>
        <Hero/>
        <AboutUs/>
        <Timeline/>
        <Sponsors/>
        <Partners/>
        <Testimonial/>
        <Glimpses/>
        <Community/>
        <FAQ/>
        <Footer/>
    </AnimatedBackground>
  );
}
