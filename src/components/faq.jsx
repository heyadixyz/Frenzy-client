"use client";

import React, { useState, useRef, useEffect } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleFaq = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-700/30 overflow-hidden shadow-lg">
      <button
        onClick={toggleFaq}
        className={`faq-toggle w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-t-xl hover:bg-white/5 transition-all duration-200 ${isOpen ? 'bg-white/5' : ''}`}
      >
        <h3 className="text-xl font-bold text-gray-100">{question}</h3>
        <span className={`text-blue-400 text-2xl transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          {isOpen ? '×' : '+'}
        </span>
      </button>
      <div
        ref={contentRef}
        className="faq-content overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
      >
        <div className="px-6 py-5 border-t border-gray-700/30 text-gray-300">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "How can I register for Tech Frenzy Hackathon?",
      answer: "Registration is available through our website. Click on the \"Register Now\" button at the top of the page to create an account and secure your spot. You can register either as an individual participant or as a team of up to 4 members."
    },
    {
      question: "What tools and technologies can we use during the hackathon?",
      answer: "You're free to use any programming languages, frameworks, libraries, or APIs you prefer. We encourage innovative approaches and creative technology stacks. All code must be written during the hackathon period, though you may use open-source libraries and frameworks as building blocks."
    },
    {
      question: "How will projects be judged and what are the prizes?",
      answer: "Projects will be evaluated based on innovation, technical complexity, user experience, practical applicability, and presentation quality. Our panel of industry experts will review all submissions. Prizes include cash awards ($10,000 for first place, $5,000 for second place, $2,500 for third place), mentorship opportunities with leading tech companies, and hardware packages for special category winners."
    },
    {
      question: "What support will be available during the hackathon?",
      answer: "Throughout the hackathon, we'll provide technical mentors from various specializations who can help with code review, debugging, and architecture decisions. We'll also host virtual workshops and Q&A sessions with industry experts. Our support team will be available 24/7 via the hackathon Discord channel to address any questions or issues you might encounter."
    },
    {
      question: "How do teams submit their projects and present them?",
      answer: "Teams will submit their projects through our hackathon platform, including code repositories, project descriptions, and demo videos (max 3 minutes). Finalists will be invited to present their projects live in a 5-minute presentation followed by 3 minutes of Q&A with our judges. All presentations will be streamed live for the entire hackathon community to watch."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 py-16 text-white">
      <div className="mb-20 md:mb-24 text-center">
        {/* <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300 mb-4">
          Questions
        </div> */}
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
