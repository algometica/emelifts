export const PLAN_NAMES = {
  monthly: 'Monthly',
  challenge: '6 week challenge',
  wedding: 'Wedding prep',
  complimentary: 'Complimentary',
};

export function planName(id) {
  return PLAN_NAMES[id] || id || 'No plan';
}

export const PLANS = [
  {
    id: 'challenge',
    name: '6 Week Challenge',
    price: '$222 CAD one-time',
    interval: 'one_time',
    envPrice: 'PADDLE_PRICE_CHALLENGE',
    weeks: 6,
  },
  {
    id: 'wedding',
    name: '12 Week Wedding Prep',
    price: '$444 CAD one-time',
    interval: 'one_time',
    envPrice: 'PADDLE_PRICE_WEDDING',
    weeks: 12,
  },
  {
    id: 'monthly',
    name: 'Lift with EME, Monthly',
    price: '$55 CAD / 4 weeks',
    interval: 'subscription',
    envPrice: 'PADDLE_PRICE_MONTHLY',
    weeks: 4,
  },
];

export function weeksForPlan(planId) {
  return planById(planId)?.weeks || 4;
}

export function planById(id) {
  return PLANS.find((p) => p.id === id) ?? PLANS.find((p) => p.id === 'wedding');
}

export function paddlePriceId(planId) {
  const plan = planById(planId);
  return process.env[plan.envPrice] || '';
}

export function paddleConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      (process.env.PADDLE_PRICE_MONTHLY ||
        process.env.PADDLE_PRICE_CHALLENGE ||
        process.env.PADDLE_PRICE_WEDDING)
  );
}
