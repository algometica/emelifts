import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: 'Lift with EME',
      price: 'Custom',
      features: ['A monthly at-home workout program designed to build real strength through fundamental, proven movements.'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=262791246d5549ceae96edfa38e59b05',
    },
    {
      name: '28 Day burn - June 1',
      price: 'Custom',
      features: ['28 Day Burn: Burn fat, lean out, and feel confident in 28 days.'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=e081c7397a73460f8f60bdec1ac84ea5',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-200">
          Result-Driven Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;