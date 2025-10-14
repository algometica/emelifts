const PricingCard = ({ plan, index }) => {
    return (
      <div className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}>
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
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
                {plan.popular && (
                  <div className="text-3xl">🔥</div>
                )}
              </div>
              
              {/* Highlight and savings for popular plan */}
              {plan.popular && plan.highlight && (
                <div className="mb-4 p-3 bg-gradient-to-r from-pink-500/20 to-teal-500/20 rounded-lg border border-pink-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-bold text-sm">{plan.highlight}</span>
                    {plan.savings && (
                      <span className="text-teal-400 font-bold text-sm bg-teal-500/20 px-2 py-1 rounded">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {plan.popular && (
                <div className="mb-6">
                  <div className="text-sm text-pink-400 mb-2">✨ Best Value</div>
                  <div className="text-2xl font-bold text-white">
                    Limited Time Offer
                  </div>
                </div>
              )}
              
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
              <div className="btn-primary w-full text-center group-hover:scale-105 transition-transform duration-200">
                {plan.popular ? 'Claim Your Spot Now' : 'Get Started Today'}
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