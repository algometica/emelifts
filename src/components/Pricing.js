import PricingCard from './PricingCard';

const Pricing = () => {
  const plans = [
    {
      name: '6 Week Challenge - April 14',
      price: 'Custom',
      features: ['In person challenge to get strong, fit and lean'],
      link: 'https://emelifts.punchpass.com/passes/224600?check=1740968332',
    },
    {
      name: '6 Week Starter - Online',
      price: 'Custom',
      features: ['Build a strong base of strength and lean muscle in this 6 Week online program'],
      link: 'https://www.trainerize.me/checkout/emelifts/EMELYN.ESCOBIDO?planGUID=8afa236b68ec45b397f8d7938c7ba0a5',
    },
    {
      name: 'Wedding Prep',
      price: 'Custom',
      features: ['Look and feel great for your wedding events with our trademarked Wedding Prep™ program'],
      link: 'https://www.trainerize.me/profile/emelifts/?planGUID=4184a158f9284055834acee9a548ebd6',
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