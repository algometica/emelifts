import React from 'react';

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-teal-500/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Ready to Transform Your Life?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Join hundreds of women who have already started their journey to becoming stronger, fitter, and more confident. Your transformation starts today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://forms.gle/SFtKRzZcq1wu7v8K8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xl px-12 py-6 transform hover:scale-105 transition-all duration-200"
            >
              Start Your Journey Now
              <span className="ml-2">🚀</span>
            </a>
            <a
              href="#pricing"
              className="btn-secondary text-xl px-12 py-6"
            >
              View Programs
              <span className="ml-2">💪</span>
            </a>
          </div>
          
          {/* Urgency element */}
          <div className="bg-gradient-to-r from-pink-500/10 to-teal-500/10 rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-pink-400 animate-pulse">🔥</span>
              <span className="text-pink-400 font-semibold">Limited Spots Available</span>
              <span className="text-pink-400 animate-pulse">🔥</span>
            </div>
            <p className="text-gray-300">
              Next 6-week challenge starts soon. Don't miss your chance to transform with personalized coaching.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
