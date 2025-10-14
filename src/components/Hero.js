const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-teal-500/10"></div>
      
      {/* Animated background elements - optimized for performance */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow will-change-transform"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow will-change-transform" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-tight mb-8">
            <span className="block text-pink-400">Stronger.</span>
            <span className="block text-pink-400">Fitter.</span>
            <span className="block text-pink-400">Leaner.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your body and mind with personalized fitness coaching that celebrates your cultural heritage while building strength that lasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="#pricing" className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </a>
            <a href="#about" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;