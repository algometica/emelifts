import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: '6 Week Online Challenge - Nov 4',
      price: 'Custom',
      features: [
        'Flexible schedule - train anytime, anywhere',
        'HD video demonstrations for every exercise',
        'Cultural food integration meal plans',
        'Weekly check-ins and motivation'
      ],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=3066f75bdf0f47d6b8a9b23a2db07468',
      popular: true,
      badge: 'Most Popular',
      highlight: '🔥 HOT DEAL',
      savings: 'Save 30%'
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Result-Driven Program
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive program tailored to your lifestyle and goals, including personalized coaching and cultural food integration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              index={index}
            />
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cultural Food Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Proven Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;