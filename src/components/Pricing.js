import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: '28 Day Burn',
      price: 'Custom',
      features: ['28 Day Burn: Burn fat, lean out, and feel confident in 28 days.'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=8f8ec24b98f44ea686e5270043123be3',
    },
    {
      name: '6 Week Starter - Online',
      price: 'Custom',
      features: ['Build a strong base of strength and lean muscle in this 6 Week online program'],
      link: 'https://www.trainerize.me/checkout/emelifts/EMELYN.ESCOBIDO?planGUID=8afa236b68ec45b397f8d7938c7ba0a5',
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