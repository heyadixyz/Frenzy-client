"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandInstagram,
    IconMail
} from '@tabler/icons-react';

// Update the image size to 100px x 100px and adjust the card dimensions accordingly
const TeamMember = ({ name, role, imageSrc, socialLinks }) => {
    return (
        <motion.div
            className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-900/90 to-gray-800/70 rounded-xl border border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
                y: -10,
                scale: 1.03,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 15
                }
            }}
        >
            {/* Changed image container size to 100px x 100px */}
            <div className="relative w-[100px] h-[100px] mb-4 rounded-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            </div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-blue-400 text-sm">{role}</p>

            <motion.div
                className="flex justify-center space-x-3 mt-1 mb-2"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
            >
                {socialLinks.map((link, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href={link.url} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-full transition-all">
                            {link.icon}
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

const Team = () => {
    const teamMembers = [
        {
            name: "Donald",
            role: "Lead Developer",
            imageSrc: "/profile.jpg",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:maxwell@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        },
        {
            name: "Mux",
            role: "UX Designer",
            imageSrc: "/profile2.jpg",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:alicia@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        },
        {
            name: "Robert Johnson",
            role: "Backend Developer",
            imageSrc: "https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/expert1.png",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:robert@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        },
        {
            name: "Emily Williams",
            role: "Project Manager",
            imageSrc: "https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/expert2.png",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:emily@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        },
        {
            name: "Daniel Brown",
            role: "DevOps Engineer",
            imageSrc: "https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/expert1.png",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:daniel@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        },
        {
            name: "Sophia Garcia",
            role: "Frontend Developer",
            imageSrc: "https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/expert2.png",
            socialLinks: [
                { url: "https://twitter.com/", icon: <IconBrandTwitter className="h-5 w-5 text-white" /> },
                { url: "https://facebook.com/", icon: <IconBrandFacebook className="h-5 w-5 text-white" /> },
                { url: "https://instagram.com/", icon: <IconBrandInstagram className="h-5 w-5 text-white" /> },
                { url: "mailto:sophia@example.com", icon: <IconMail className="h-5 w-5 text-white" /> }
            ]
        }
    ];

    return (
        <section id="team" className="py-24 md:py-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] opacity-50"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[120px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-purple-900/5 rounded-full filter blur-[150px] opacity-30"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="max-w-xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-sm font-medium text-blue-300 mb-4">
                        Meet Our Team
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                        The People Behind Tech Frenzy
                    </h2>
                    <motion.div
                        className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6"
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    ></motion.div>
                </motion.div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-10">
                    {teamMembers.map((member, index) => (
                        <TeamMember
                            key={index}
                            name={member.name}
                            role={member.role}
                            imageSrc={member.imageSrc}
                            socialLinks={member.socialLinks}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;