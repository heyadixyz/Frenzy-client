"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const initialRender = useRef(true);

    const closeMenu = useCallback(() => {
        if (isMenuOpen) setIsMenuOpen(false);
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('button[aria-label="Toggle menu"]')) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen, closeMenu]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        if (!mobileMenuRef.current) return;

        const menu = mobileMenuRef.current;

        if (isMenuOpen) {
            requestAnimationFrame(() => {
                menu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    menu.style.maxHeight = `${menu.scrollHeight}px`;
                });
            });
        } else {
            menu.style.maxHeight = "0";
            const handleTransitionEnd = () => {
                if (menu.style.maxHeight === "0px" && !isMenuOpen) {
                    menu.classList.add('hidden');
                }
                menu.removeEventListener('transitionend', handleTransitionEnd);
            };

            menu.addEventListener('transitionend', handleTransitionEnd);
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <nav className="sticky top-5 z-[10] bg-[rgba(40,40,42,0.6)] backdrop-filter backdrop-blur-[10px] border border-white/10 px-4 py-2 w-[90%] lg:w-[65%] xl:w-[75%] 2xl:w-[65%] mx-auto rounded-[14px] will-change-transform">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
                <div className="flex items-center space-x-3">
                    <span className="text-white text-2xl font-extrabold tracking-tight">Tech Frenzy</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden xl:flex space-x-2 text-white/90 font-medium">
                    {['About Us', 'Timeline', 'Glimpses', 'FAQ', 'Community Partners', 'Sponsors'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="relative px-3 py-2 transition-all duration-300 ease-in-out rounded-md hover:text-white group"
                        >
                            <span className="relative z-10">{item}</span>
                            <span className="absolute inset-0 bg-[rgba(132,132,134,0.2)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
                        </Link>
                    ))}
                </div>

                <Link
                    href="#register"
                    className="hidden xl:block bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                >
                    Register Now
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="xl:hidden text-white focus:outline-none touch-manipulation"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu (Collapsible) */}
            <div
                ref={mobileMenuRef}
                className="xl:hidden overflow-hidden max-h-0 transition-[max-height] duration-500 ease-out bg-[transaparent] p-4 rounded-lg mt-2 hidden"
                aria-hidden={!isMenuOpen}
            >
                {['About Us', 'Timeline', 'Glimpses', 'FAQ', 'Community Partners', 'Sponsors'].map((item, index) => (
                    <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-white py-2 hover:text-blue-400 transition-colors duration-200"
                        onClick={closeMenu}
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        {item}
                    </Link>
                ))}
                <Link
                    href="/gallery"
                    className="block bg-blue-500 text-white text-center py-2 rounded-lg mt-2 hover:bg-blue-700 transition-colors duration-300"
                    onClick={closeMenu}
                >
                    Register Now
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;