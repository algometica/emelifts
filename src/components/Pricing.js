import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: 'Lift with EME - Monthly',
      price: 'Custom',
      features: [
        'Progressive, structured training built for real, lasting results',
        'Build strength and lean muscle while staying functional and resilient',
        'Effective at-home workouts that fit busy schedules',
        'Expert programming that removes guesswork - train with confidence and consistency'
      ],
      link: 'https://www.trainerize.me/checkout/emelifts/EMELYN.ESCOBIDO?planGUID=262791246d5549ceae96edfa38e59b05',
      popular: true,
      badge: 'Signature Program'
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
            A comprehensive at-home program tailored to your lifestyle and goals, with personalized coaching.
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
              <span>Progressive Programming</span>
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