import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: 'Wedding Prep',
      price: 'Custom',
      features: ['Look and feel great for your wedding events'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=4184a158f9284055834acee9a548ebd6',
    },
    {
      name: 'Triple Threat Fit Forties',
      price: 'Custom',
      features: ['Get fit and strong for your 40s.', 'A program that addresses hormonal changes, weight gain and muscle loss'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=75c6cf9032a044ab9ca6d793ba4a6060',
    },
    {
      name: 'Lift With EME',
      price: 'Custom',
      features: ['A Structured monthly workout program to get you stronger and fitter.'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=9c1a510dde9b41748eb79cdaef596d47',
    },
    {
      name: '1:1 Coaching',
      price: 'Custom',
      features: ['Achieve your goals with specialized coaching created specific to you.', 'Get Priority support'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=f4beafca6bdf4b1d95cce5cf90155d7b',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-200">
          Result-Driven Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;