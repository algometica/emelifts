import React from 'react';

const Testimonials = () => {
  const StarIcon = () => (
    <svg
      className="w-5 h-5 text-yellow-400"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  const testimonials = [
    {
      name: "Sarah M.",
      text: "The online program was perfect for my busy schedule! I could work out at 5 AM before my kids woke up. The video demonstrations were so clear, and Em's weekly check-ins kept me motivated.",
      rating: 5,
      program: "Monthly Program"
    },
    {
      name: "Susie H.",
      text: "I loved being able to train from home! The nutrition guidance was a game-changer. I lost 15 pounds while still enjoying the foods I love.",
      rating: 5,
      program: "Monthly Program"
    },
    {
      name: "Jennifer K.",
      text: "The online program gave me the confidence to start lifting weights. The video-tutorials made it easy to learn proper form, and I could rewatch them anytime.",
      rating: 5,
      program: "Monthly Program"
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-teal-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real results from real women who transformed their lives with Emelifts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="dark-card p-8 text-center animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`}}>
              {/* Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="inline-flex">
                    <StarIcon />
                  </span>
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author */}
              <div className="border-t border-gray-700 pt-4">
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.program}</div>
                {testimonial.highlight && (
                  <div className="text-xs text-pink-400 mt-1 font-medium">
                    {testimonial.highlight}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>800+ Clients Trained</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>5-Star Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
