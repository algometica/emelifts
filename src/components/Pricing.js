import PricingCard from './PricingCard';
import { ENROLL_URL, CHALLENGE_URL, WEDDING_URL } from '../lib/links';

const challenge = {
  name: '6 Week Challenge',
  badge: 'Limited, Sept 7',
  price: '$222 CAD · one-time',
  meta: 'Starts September 7, 2026',
  features: [
    'Workout program designed to get you lean',
    'Customized meal plan for maximum results',
    'Home or gym, your choice',
  ],
  link: CHALLENGE_URL,
  cta: 'Join the Challenge',
};

const wedding = {
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

const plan = {
  name: 'Lift with EME, Monthly',
  badge: 'Signature program',
  features: [
    'Progressive strength blocks, so you know what to lift each session',
    "Check-ins so you're not training alone in the dark",
  ],
  link: ENROLL_URL,
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
            One membership. Full plan.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-snug text-[#6e6e73] md:text-[19px]">
            Enroll once. Your workouts and coaching updates stay in sync.
          </p>
        </div>

        <div className="mx-auto grid items-start gap-4 md:grid-cols-3">
          <PricingCard plan={challenge} dark />
          <PricingCard plan={wedding} bgClass="bg-[#9B3B1A]" />
          <PricingCard plan={plan} />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
