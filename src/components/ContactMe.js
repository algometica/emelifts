import React from 'react';

const ContactMe = () => {
  const googleFormLink = 'https://forms.gle/SFtKRzZcq1wu7v8K8';

  return (
    <section id="contact" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="dark-card p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Transform?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-teal-500 mx-auto mb-8"></div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Have questions or want to discuss your fitness needs? Let's create a personalized plan that works for your lifestyle and celebrates your cultural heritage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href={googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4"
              >
                Get in Touch
                <span className="ml-2">💬</span>
              </a>
              <a
                href="https://www.instagram.com/emelifts/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4"
              >
                Follow on Instagram
                <span className="ml-2">📸</span>
              </a>
            </div>
            
            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">📧</span>
                </div>
                <span className="font-semibold">Quick Response</span>
                <span className="text-sm">Usually within 24 hours</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <span className="font-semibold">Personalized Plan</span>
                <span className="text-sm">Tailored to your goals</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🌍</span>
                </div>
                <span className="font-semibold">Cultural Integration</span>
                <span className="text-sm">Honor your heritage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;