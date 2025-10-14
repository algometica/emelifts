'use client';

import React, { useState } from 'react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMenu}
        className="md:hidden text-gray-300 hover:text-pink-500 transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeMenu}></div>
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/90">
                <h2 className="text-xl font-bold gradient-text">Menu</h2>
                <button 
                  onClick={closeMenu}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 bg-gray-900/95">
                <ul className="space-y-4">
                  <li>
                    <a 
                      href="#pricing" 
                      onClick={closeMenu}
                      className="block text-lg text-gray-300 hover:text-pink-500 transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/50"
                    >
                      Programs
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#about" 
                      onClick={closeMenu}
                      className="block text-lg text-gray-300 hover:text-pink-500 transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/50"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#testimonials" 
                      onClick={closeMenu}
                      className="block text-lg text-gray-300 hover:text-pink-500 transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/50"
                    >
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contact" 
                      onClick={closeMenu}
                      className="block text-lg text-gray-300 hover:text-pink-500 transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/50"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>

              {/* CTA Button */}
              <div className="p-6 border-t border-gray-700/50 bg-gray-900/90">
                <a 
                  href="https://forms.gle/SFtKRzZcq1wu7v8K8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="btn-primary w-full text-center block"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
