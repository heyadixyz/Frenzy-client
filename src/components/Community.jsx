"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import {
    IconBrandTwitter,
    IconBrandDiscord,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin
} from '@tabler/icons-react';

const PolaroidImage = ({ position, rotationDeg, tapeDeg, imageSrc, altText, hashtag, zIndex, delay }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: delay || Math.random() * 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        });
    }, [controls, delay]);

    return (
        <motion.div
            className={`absolute ${position} polaroid`}
            style={{
                '--rotate-deg': rotationDeg,
                '--tape-deg': tapeDeg,
                zIndex: zIndex || 10
            }}
            initial={{ opacity: 0, scale: 0.7, rotate: `calc(var(--rotate-deg) - 10deg)` }}
            animate={controls}
            whileHover={{
                scale: 1.05,
                rotate: `calc(var(--rotate-deg) + ${Math.random() > 0.5 ? 3 : -3}deg)`,
                boxShadow: "0 20px 30px rgba(0,0,0,0.4), 0 15px 20px rgba(0,0,0,0.3)",
                transition: { duration: 0.3, ease: "easeOut" }
            }}
        >
            <div className="tape" style={{ transform: `rotate(var(--tape-deg))` }}></div>
            <div className="relative w-full aspect-[5/7] bg-white overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={altText}
                    fill
                    sizes="(max-width: 768px) 93vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    priority
                />
            </div>
            <p className="text-center mt-2 font-marker text-gray-800 text-[10px] sm:text-sm tracking-wide font-medium break-words sm:break-normal max-w-[100%] sm:max-w-full mx-auto">
                {hashtag}
            </p>


        </motion.div>
    );
};

const SocialLink = ({ icon, platform, href }) => {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <motion.div
                className="bg-gray-800/80 backdrop-filter backdrop-blur-sm px-5 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition border border-gray-700/50"
                whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
            >
                {icon}
                <span className="font-medium text-sm md:text-base">{platform}</span>
            </motion.div>
        </Link>
    );
};

const Community = () => {
    const eventImages = [
        {
            src: "/tech.jpeg",
            alt: "Tech Conference",
            hashtag: "#DevFest2024",
            position: "top-[-10%] right-[-5%] w-[20%] md:w-[18%]",
            rotate: "8deg",
            tape: "-5deg",
            zIndex: 30,
            delay: 0.4
        },
        {
            src: "/tech.jpeg",
            alt: "Hackathon",
            hashtag: "#CodeChallenge",
            position: "top-[55%] left-[5%] w-[18%] md:w-[14%]",
            rotate: "-12deg",
            tape: "5deg",
            zIndex: 15,
            delay: 0.6
        },
        {
            src: "/tech.jpeg",
            alt: "Workshop",
            hashtag: "#TechSkills",
            position: "top-[60%] right-[16%] w-[24%] md:w-[19%]",
            rotate: "4deg",
            tape: "-2deg",
            zIndex: 25,
            delay: 0.8
        },
        {
            src: "/tech.jpeg",
            alt: "Tech Meetup",
            hashtag: "#TechCommunity",
            position: "bottom-[70%] md:bottom-[60%] left-[19%] md:left-[30%] w-[23%] md:w-[16%]",
            rotate: "6deg",
            tape: "-5deg",
            zIndex: 40,
            delay: 0.5
        }
    ];

    const socialLinks = [
        { platform: "Twitter", icon: <IconBrandTwitter size={24} stroke={1.5} className="text-blue-400" />, href: "https://twitter.com/" },
        { platform: "Discord", icon: <IconBrandDiscord size={24} stroke={1.5} className="text-indigo-400" />, href: "https://discord.com/" },
        { platform: "GitHub", icon: <IconBrandGithub size={24} stroke={1.5} className="text-gray-300" />, href: "https://github.com/" },
        { platform: "Instagram", icon: <IconBrandInstagram size={24} stroke={1.5} className="text-pink-400" />, href: "https://instagram.com/" },
        { platform: "LinkedIn", icon: <IconBrandLinkedin size={24} stroke={1.5} className="text-blue-500" />, href: "https://linkedin.com/" }
    ];

    return (
        <section id="community" className="bg-transparent text-white pt-16 pb-10 px-4 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] opacity-50"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[120px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-purple-900/5 rounded-full filter blur-[150px] opacity-30"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            <div className="max-w-6xl mx-auto relative">
                <div className="mb-20 md:mb-24 text-center">
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300 mb-4">
                        Join Our Vibrant Community
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
                        Be Part of Something Extraordinary
                    </h2>
                    <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>

                <div className="w-full aspect-[3/4] sm:aspect-[21/9] bg-gradient-to-br from-gray-900 to-gray-800/90 grid-bg relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] mx-auto mb-24 rounded-2xl overflow-hidden border border-white/10 p-4">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-full bg-grid-pattern opacity-10"></div>
                        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-800/5 rounded-full filter blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-indigo-800/5 rounded-full filter blur-[60px]"></div>
                    </div>
                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[5] text-center w-full px-4">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text drop-shadow-2xl">
                            Get a glimpse of Tech Frenzy
                        </h3>
                    </div>
                    {eventImages.map((image, index) => (
                        <PolaroidImage
                            key={index}
                            position={image.position}
                            rotationDeg={image.rotate}
                            tapeDeg={image.tape}
                            imageSrc={image.src}
                            altText={image.alt}
                            hashtag={image.hashtag}
                            zIndex={image.zIndex}
                            delay={image.delay}
                        />
                    ))}
                </div>
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {socialLinks.map((link, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                                <SocialLink
                                    icon={link.icon}
                                    platform={link.platform}
                                    href={link.href}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        .grid-bg {
          background-color: rgba(12, 12, 18, 0.9);
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: center;
        }

        .polaroid {
          background: #fff;
          padding: 0.75rem 0.29rem 0.9rem;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3), 0 10px 15px rgba(0, 0, 0, 0.2);
          transform: rotate(var(--rotate-deg));
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          transform-origin: center center;
        }

        .tape {
          position: absolute;
          width: 40%;
          height: 1.5rem;
          background-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
          transform: rotate(var(--tape-deg));
          top: -0.75rem;
          left: calc(50% - 20%);
          z-index: 5;
          opacity: 0.85;
        }

        .tape::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.4) 50%,
                  transparent 100%);
        }

        .gradient-text {
          background: linear-gradient(90deg,
                  #ffffff, #edf2ff, #d4e6ff);
          background-size: 200% 100%;
          animation: gradient-shift 10s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0px 4px 20px rgba(50, 50, 50, 0.5);
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
        </section>
    );
};

export default Community;