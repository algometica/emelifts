import PricingCard from './PricingCard';
import { WEDDING_URL } from '../lib/links';

const plan = {
  name: '12 Week Wedding Prep',
  badge: 'Bridal Program',
  features: [
    'Your dream wedding body',
    'Look amazing in every outfit, every event',
    '12 weeks of targeted bridal training',
  ],
  link: WEDDING_URL,
  cta: 'Start Prep',
};

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="border-t border-black/[0.06] bg-white py-[4.5rem] md:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto max-w-[1100px]">
        <div className="mb-12 text-center md:mb-14">
          <h2
            id="pricing-heading"
            className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          >
            The program
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-snug text-[#6e6e73] md:text-[19px]">
            Twelve weeks of coaching in the app. Enroll, then train.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <PricingCard plan={plan} bgClass="bg-[#9B3B1A]" />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
