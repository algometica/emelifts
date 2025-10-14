import React from 'react';
import Image from 'next/image';

const AboutMe = () => {
  return (
    <section id="about" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="dark-card p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Who is Emelifts?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-teal-500 mx-auto mb-8"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src="/emelifts.png"
                  alt="Em - Fitness Coach and Personal Trainer specializing in strength training and cultural food integration"
                  width={256}
                  height={256}
                  className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-gradient-to-r from-pink-500 to-teal-500 shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 192px, 256px"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                  💪
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-grow text-center lg:text-left">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Hi! I'm Em 👋
                </h3>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  I train and coach women who want to change their lives to be stronger, fitter, and leaner. We lift heavy weights to build lean muscle to fight diseases and we eat our cultural foods for the best optimized health.
                </p>
              </div>
              
              {/* Key points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-300">Personalized Training</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-300">Cultural Food Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-300">Strength & Muscle Building</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-300">Disease Prevention Focus</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#pricing" className="btn-primary">
                  Start Training
                </a>
                <a href="#contact" className="btn-secondary">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;