import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: '6 Week Challenge – Sept 8, 2025',
      price: 'Custom',
      features: [
        'Results in 6 weeks with an expertly created program. Get ready for a transformation.'
      ],
      link: 'https://www.trainerize.me/checkout/emelifts/EMELYN.ESCOBIDO?planGUID=3066f75bdf0f47d6b8a9b23a2db07468',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-200">
          Result-Driven Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
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
