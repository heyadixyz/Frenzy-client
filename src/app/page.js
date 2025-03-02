'use client';

import Navbar from '../components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      

      {/* Main Section */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-white relative z-0">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Welcome to Tech Frenzy</h1>
          <p className="mt-6 text-xl text-gray-300">A modern platform with a beautiful glassmorphic interface</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-600">
              Get Started
            </a>
            <a href="#" className="px-6 py-3 rounded-lg font-medium text-center border border-white/20 hover:bg-white/10 transition-all">
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="max-w-5xl mx-auto px-4 py-16 text-white">
        <h2 className="text-3xl font-bold mb-8">About Us</h2>
        <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-6">
          <p className="mb-4">Tech Frenzy is a premier tech conference bringing together developers, designers, and technology enthusiasts from around the world.</p>
          <p className="mb-4">Our mission is to create an environment where innovation thrives and connections are forged. Whether you're a seasoned professional or just starting your journey in tech, Tech Frenzy offers something valuable for everyone.</p>
          <p>Join us for three days of inspiring talks, hands-on workshops, and networking opportunities with industry leaders.</p>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="max-w-5xl mx-auto px-4 py-16 text-white">
        <h2 className="text-3xl font-bold mb-8">Event Timeline</h2>
        <div className="space-y-8">
          {[
            { day: "Day 1 - Opening Ceremony", details: "Keynote speakers, panel discussions, and welcome reception.", date: "June 15, 2025 • 9:00 AM - 5:00 PM" },
            { day: "Day 2 - Workshops & Hackathon", details: "Hands-on workshops, coding challenges, and networking lunch.", date: "June 16, 2025 • 9:00 AM - 8:00 PM" },
            { day: "Day 3 - Presentations & Awards", details: "Project presentations, award ceremony, and closing gala.", date: "June 17, 2025 • 10:00 AM - 6:00 PM" }
          ].map((event, index) => (
            <div key={index} className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">{event.day}</h3>
              <p>{event.details}</p>
              <div className="mt-4 text-blue-400">{event.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Glimpses Section */}
      <section id="glimpses" className="max-w-5xl mx-auto px-4 py-16 text-white">
        <h2 className="text-3xl font-bold mb-8">Glimpses from Previous Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Keynote Session 2024",
            "Workshop on AI Development",
            "Networking Reception"
          ].map((title, index) => (
            <div key={index} className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-700"></div>
              <div className="p-4">
                <p>{title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-5xl mx-auto px-4 py-16 text-white">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { question: "How can I register for Tech Frenzy?", answer: "Registration is available through our website. Click on the 'Register Now' button at the top of the page to secure your spot." },
            { question: "What is included in the registration fee?", answer: "Your registration includes access to all keynotes, workshops, networking events, meals during the conference, and exclusive Tech Frenzy merchandise." },
            { question: "Are there any scholarship opportunities available?", answer: "Yes, we offer a limited number of diversity scholarships. Please check our scholarship page for more information and application details." }
          ].map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
