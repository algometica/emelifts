// src/components/AboutMe.jsx (or .tsx)
import React from 'react';

const AboutMe = () => {
  return (
    <section className="dark-card py-12 mb-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-200 mb-6">Who is Emelifts?</h2>
        <div className="flex justify-center">
            <img
                src="emelifts.png"  // Replace with your actual profile image path
                alt="Your Profile"
                className="rounded-full w-32 h-32 object-cover mr-4"
            />
            <div className="text-gray-400 text-lg dark-card-text">
                <p>
                Hi! I'm Em. I train and coach women who want to change their lives, to be stronger, fitter, and leaner. We lift heavy weights to build lean muscle to fight diseases and we eat our cultural foods for the best optimized health.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;