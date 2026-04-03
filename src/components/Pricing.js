import PricingCard from './PricingCard';
import { ENROLL_URL } from '../lib/links';

const plan = {
  name: 'Lift with EME, Monthly',
  features: [
    'Progressive strength blocks, so you know what to lift each session',
    'Check-ins so you’re not training alone in the dark',
  ],
  link: ENROLL_URL,
  badge: 'Signature program',
};

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="border-t border-black/[0.06] bg-white py-[4.5rem] md:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto max-w-[980px]">
        <div className="mb-12 text-center md:mb-14">
          <h2
            id="pricing-heading"
            className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          >
            One membership. Full plan.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-snug text-[#6e6e73] md:text-[19px]">
            Enroll once. Your workouts and coaching updates stay in sync.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <PricingCard plan={plan} />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
