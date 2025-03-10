"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Partner = ({ name, logo }) => {
    return (
        <motion.div
            className="group"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <div className="h-32 flex items-center justify-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80 hover:border-blue-700/30 hover:shadow-lg hover:shadow-blue-900/10">
                <div className="relative h-16 w-full">
                    <Image
                        src={logo}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain transition-all duration-300"
                    />
                </div>
            </div>
            <p className="mt-3 text-center text-sm text-gray-400 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {name}
            </p>
        </motion.div>
    );
};

const Partners = () => {
    const partners = [
        {
            name: "Google",
            logo: "/logo.png"
        },
        {
            name: "Microsoft",
            logo: "/logo.png"
        },
        {
            name: "Meta",
            logo: "/logo.png"
        },
        {
            name: "Amazon",
            logo: "/logo.png"
        },
        {
            name: "Apple",
            logo: "/logo.png"
        },
    ];

    return (
        <section id="community-partners" className="pt-16 pb-0 px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] opacity-50"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[120px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-purple-900/5 rounded-full filter blur-[150px] opacity-30"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    className="max-w-xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300 mb-4">
                        Our Partners
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                        Meet our Community Partners
                    </h2>
                    <motion.div
                        className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6"
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    ></motion.div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Partner name={partner.name} logo={partner.logo} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;