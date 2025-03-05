'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const emailInputRef = useRef(null);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setShowSuccess(true);
    emailInputRef.current.value = '';
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      ),
    },
    {
      name: 'Twitter X',
      href: '#',
      icon: (
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      ),
    },
  ];

  return (
    <footer className="footer-container bg-[transparent] backdrop-filter backdrop-blur-md rounded-2xl mx-auto my-12 p-8 max-w-7xl text-white w-[100%]">
      <div className="max-w-6xl mx-auto mb-16 p-8 rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative w-20 h-20 flex-shrink-0 group">
            <div className="absolute top-3 left-3 w-full h-full bg-blue-900/70 rounded transform rotate-6 transition-transform group-hover:rotate-9 duration-300"></div>
            <div className="absolute top-1.5 left-1.5 w-full h-full bg-blue-800/80 rounded transform -rotate-3 transition-transform group-hover:-rotate-6 duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded shadow-md transition-all group-hover:shadow-blue-500/20 group-hover:shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 opacity-95" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-white text-2xl font-semibold mb-2 tracking-tight">Stay informed with our newsletter</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Receive the latest updates, industry insights, and exclusive content delivered directly to your inbox.</p>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0">
            <form id="newsletter-form" className="flex flex-col md:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
              <div className="relative w-full md:w-80">
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  placeholder="Your email address"
                  className="bg-gray-800/80 text-white placeholder-gray-400 px-4 py-3 pr-28 rounded-lg w-full border border-gray-700/60 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors font-medium text-sm"
                >
                  Subscribe
                </button>
                {showError && (
                  <div className="absolute -bottom-6 left-0 text-xs text-red-400">
                    Please enter a valid email address
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
        {showSuccess && (
          <div className="mt-4 text-sm text-center text-blue-400 font-medium">
            Thank you for subscribing. We've sent a confirmation email to your inbox.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-white mb-12 px-2">
        <div>
          <h4 className="text-gray-300 font-medium mb-5 flex items-center text-sm uppercase tracking-wider">
            <span className="text-emerald-400 mr-2">//</span>
            Developer
          </h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Documentation</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Get API Key</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Example Apps</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-300 font-medium mb-5 flex items-center text-sm uppercase tracking-wider">
            <span className="text-blue-500 mr-2">//</span>
            Network
          </h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Whitepaper</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Media Node</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Media Node Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-300 font-medium mb-5 flex items-center text-sm uppercase tracking-wider">
            <span className="text-blue-500 mr-2">//</span>
            Company
          </h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"></span> About Us</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"></span> Blog</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Brand Assets</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Terms</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Privacy</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"><span className="mr-2 opacity-70"> </span> Contact Us</Link></li>
          </ul>
        </div>


        <div>
          <h4 className="text-gray-300 font-medium mb-5 flex items-center text-sm uppercase tracking-wider">
            <span className="text-blue-500 mr-2">//</span>
            Connect
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-colors border border-gray-700/30"
                aria-label={item.name}
              >
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {item.icon}
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800/50 pt-8 mt-8">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 md:mb-0">
          <div className="text-white flex flex-row items-center font-bold py-2 px-4 rounded-lg mr-3">
            <img src="/logo.png" alt="Tech Frenzy" className="h-8 w-auto mr-1" />
            Tech Frenzy
          </div>
          <span className="text-gray-400 text-sm">Copyright © 2025 Tech Frenzy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
