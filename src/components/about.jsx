"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const useIntersectionObserver = (options = {}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = React.useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.once && ref.current) {
                    observer.unobserve(ref.current);
                }
            } else if (!options.once) {
                setIsVisible(false);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return [ref, isVisible];
};

const AboutUs = () => {
    const [mainRef, mainVisible] = useIntersectionObserver({ threshold: 0.2, once: true });
    const [whatWeDoRef, whatWeDoVisible] = useIntersectionObserver({ threshold: 0.2, once: true });

    return (
        <section id="about-us" className="pt-16 pb-0 px-4 bg-[transparent] relative overflow-hidden ">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full filter blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-500/10 rounded-full filter blur-[100px] -z-10"></div>

            <div className="max-w-5xl mx-auto">
                <div
                    ref={mainRef}
                    className={`mb-16 transition-all duration-1000 ease-out ${mainVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                        }`}
                >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0 px-4">
                            <div className="relative mx-auto max-w-[320px] aspect-square">
                                <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-blue-900/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/30 backdrop-blur-sm flex flex-col items-center justify-center">
                                        <div className="relative w-20 h-20 mb-4">
                                            <Image
                                                src="/logo_white.png"
                                                alt="Tech Frenzy Logo"
                                                fill
                                                objectFit="contain"
                                                className="drop-shadow-md"
                                            />
                                        </div>
                                        <span className="text-3xl sm:text-4xl font-bold text-white/80 mb-2 text-center px-4">
                                            Tech Frenzy
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-1/4 h-1/4 min-w-16 min-h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl -z-10"></div>
                                <div className="absolute -top-4 -left-4 w-1/5 h-1/5 min-w-12 min-h-12 border border-blue-500/20 rounded-2xl -z-10"></div>
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <div className="space-y-4">
                                <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300">
                                    About Us
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Empowering Tech Enthusiasts
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Tech Frenzy is a college club at <span className="font-semibold text-blue-300">Siliguri Institute of Technology</span> dedicated to fostering innovation and technical excellence.
                                    We specialize in organizing impactful tech events, interactive sessions, webinars, and
                                    hackathons that bring together passionate tech enthusiasts.
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    Our mission is to build and manage a thriving community of tech-savvy individuals,
                                    empowering them with resources, support, and opportunities to grow. Through collaboration
                                    and knowledge sharing, we aim to create an ecosystem where technology drives positive change.
                                </p>
                                <div className="pt-4">
                                    <Link href="/#community">
                                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                                            Join Our Community
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-16">
                <h2 className="md:text-4xl text-3xl font-extrabold text-center bg-gradient-to-r from-white via-blue-100 to-indigo-200 text-transparent bg-clip-text mb-4">What We Do</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[{
                            title: "Tech Events",
                            description: "From workshops to tech talks, we organize events that bring the latest technology trends to our community.",
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            ),
                        },
                        {
                            title: "Hackathons",
                            description: "Competitive coding events where participants collaborate to solve real-world problems through innovative solutions.",
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            ),
                        },
                        {
                            title: "Community Building",
                            description: "Creating a network of tech enthusiasts who share knowledge, resources, and opportunities.",
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            ),
                        },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-filter backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </section>
    );
};

export default AboutUs;
