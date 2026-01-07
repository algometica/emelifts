const PricingCard = ({ plan }) => {
    return (
      <div className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}>
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-pink-500/30 ring-1 ring-white/10">
              {plan.badge}
            </div>
          </div>
        )}
        
        <a
          href={plan.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full group"
        >
          <div className={`dark-card h-full flex flex-col relative overflow-hidden ${
            plan.popular ? 'ring-2 ring-pink-500/50' : ''
          }`}>
            {/* Gradient overlay for popular card */}
            {plan.popular && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-teal-500/5"></div>
            )}
            
            <div className="p-8 flex-grow relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold dark-card-title">
                  {plan.name}
                </h3>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 dark-card-text">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 border-t border-gray-700/50 relative z-10">
              <div className={`${plan.popular ? 'btn-featured' : 'btn-primary'} w-full text-center group-hover:scale-105 transition-transform duration-200`}>
                {plan.popular ? 'Enroll Now' : 'Get Started Today'}
                <span className="ml-2">→</span>
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </a>
      </div>
    );
  };
  
  export default PricingCard;