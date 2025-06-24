import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: '28 Day Burn',
      price: 'Custom',
      features: [
        'Look good, feel good, and achieve real results.'
      ],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=e081c7397a73460f8f60bdec1ac84ea5',
    },
    {
      name: '6 Week - The Next Phase',
      price: 'Custom',
      features: [
        'You completed the 28 Day Burn, loved your results, and now you\'re ready for more.',
        'This program is designed to help you achieve permanent results.'
      ],
      link: 'https://www.trainerize.me/checkout/emelifts/EMELYN.ESCOBIDO?planGUID=b78be814504a4ef3b14dfcec85ccb8c3',
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
