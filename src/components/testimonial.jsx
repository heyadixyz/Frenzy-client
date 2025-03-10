"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TestimonialCard = ({ color, testimony, name, role, image }) => {
    const borderClass = color === "blue" ? "border-blue-400" : "border-purple-400";
    const textClass = color === "blue" ? "text-blue-400" : "text-purple-400";

    return (
        <div className="flex-none w-80 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl backdrop-blur border border-white/10 shadow-xl">
            <svg className={`h-8 w-8 ${textClass} mb-4`} fill="currentColor" viewBox="0 0 32 32">
                <path d="M10.668 4l-2.66 9.332h-4.002v14.668h16v-14.668h-6.668l2.66-9.332h-5.33zm18.668 9.332h-4.002l2.66-9.332h-5.33l-2.66 9.332h-4.002v14.668h16v-14.668h-2.666z" />
            </svg>
            <p className="text-gray-300 mb-6 italic">{testimony}</p>
            <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full mr-4 border-2 ${borderClass} relative overflow-hidden`}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="48px"
                    />
                </div>
                <div>
                    <h4 className="text-white font-medium">{name}</h4>
                    <p className={textClass}>{role}</p>
                </div>
            </div>
        </div>
    );
};

const Testimonial = () => {
    const testimonials1 = [
        {
            testimony: "TechFrenzy provided an incredible learning environment. The workshops were not only informative but also highly engaging. I made valuable connections that have helped my career tremendously.",
            name: "Aditya",
            role: "Founder at Google",
            image: "/profile.jpg",
            color: "blue"
        },
        {
            testimony: "I've attended many tech conferences, but TechFrenzy stands out. The quality of speakers and the hands-on workshops gave me skills I could immediately apply to my projects. Completely worth it!",
            name: "David Chen",
            role: "CTO at TechNova",
            image: "/profile.jpg",
            color: "blue"
        },
        {
            testimony: "The mentorship opportunities at TechFrenzy were exceptional. I connected with industry leaders who provided valuable guidance for my career path. A truly transformative experience.",
            name: "Priya Sharma",
            role: "Frontend Developer at Microsoft",
            image: "/profile.jpg",
            color: "blue"
        },
        {
            testimony: "TechFrenzy's hackathon was instrumental in launching my startup. The feedback from judges and networking opportunities helped us refine our product and secure initial funding.",
            name: "James Wilson",
            role: "Founder at DataSync",
            image: "/profile.jpg",
            color: "blue"
        }
    ];

    const testimonials2 = [
        {
            testimony: "The networking at TechFrenzy was unmatched. I met talented developers and designers who later became collaborators on several successful projects.",
            name: "Elena Rodriguez",
            role: "UI/UX Designer at Adobe",
            image: "/profile.jpg",
            color: "purple"
        },
        {
            testimony: "As a student, I wasn't sure what to expect, but TechFrenzy welcomed newcomers with open arms. I learned about cutting-edge technologies and got my first internship through contacts I made here.",
            name: "Marcus Johnson",
            role: "ML Engineer at Amazon",
            image: "/profile.jpg",
            color: "purple"
        },
        {
            testimony: "The diverse perspectives at TechFrenzy sparked innovative thinking in our team. We implemented new approaches that increased our app's user engagement by 40% within a month.",
            name: "Aisha Patel",
            role: "Product Manager at Spotify",
            image: "/profile.jpg",
            color: "purple"
        },
        {
            testimony: "TechFrenzy's advanced security workshop helped me identify vulnerabilities in our system. The practical knowledge I gained likely prevented a major security breach at our company.",
            name: "Roy",
            role: "Security Expert at IBM",
            image: "/profile.jpg",
            color: "purple"
        }
    ];

    return (
        <section id="testimonials" className="pt-10 pb-0 px-4 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] opacity-50"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[120px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-purple-900/5 rounded-full filter blur-[150px] opacity-30"></div>
            </div>

            <motion.div
                className="max-w-xl mx-auto h-full text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300 mb-4">
                    What People Say
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                    Testimonials
                </h2>
                <motion.div
                    className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6"
                    initial={{ width: 0 }}
                    whileInView={{ width: 96 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                ></motion.div>
            </motion.div>

            <div className="relative mb-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

                <div className="flex scroll-right-animation py-4">
                    <div className="flex flex-nowrap gap-6">
                        {testimonials1.map((testimonial, index) => (
                            <TestimonialCard
                                key={`row1-${index}`}
                                color={testimonial.color}
                                testimony={testimonial.testimony}
                                name={testimonial.name}
                                role={testimonial.role}
                                image={testimonial.image}
                            />
                        ))}
                    </div>
                    <div className="flex flex-nowrap gap-6">
                        {testimonials1.map((testimonial, index) => (
                            <TestimonialCard
                                key={`row1-dup-${index}`}
                                color={testimonial.color}
                                testimony={testimonial.testimony}
                                name={testimonial.name}
                                role={testimonial.role}
                                image={testimonial.image}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

                <div className="flex scroll-left-animation py-4">
                    <div className="flex flex-nowrap gap-6">
                        {testimonials2.map((testimonial, index) => (
                            <TestimonialCard
                                key={`row2-${index}`}
                                color={testimonial.color}
                                testimony={testimonial.testimony}
                                name={testimonial.name}
                                role={testimonial.role}
                                image={testimonial.image}
                            />
                        ))}
                    </div>
                    <div className="flex flex-nowrap gap-6">
                        {testimonials2.map((testimonial, index) => (
                            <TestimonialCard
                                key={`row2-dup-${index}`}
                                color={testimonial.color}
                                testimony={testimonial.testimony}
                                name={testimonial.name}
                                role={testimonial.role}
                                image={testimonial.image}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .scroll-right-animation {
          animation: scroll-right 30s linear infinite;
        }

        .scroll-left-animation {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
        </section>
    );
};

export default Testimonial;