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
    price: 'One-time bridal program',
    interval: 'one_time',
    envPrice: 'PADDLE_PRICE_WEDDING',
    weeks: 12,
  },
  {
    id: 'monthly',
    name: 'Lift with EME, Monthly',
    price: 'Monthly subscription',
    interval: 'subscription',
    envPrice: 'PADDLE_PRICE_MONTHLY',
    weeks: 4,
  },
];

export function weeksForPlan(planId) {
  return planById(planId)?.weeks || 4;
}

export function planById(id) {
  return PLANS.find((p) => p.id === id) ?? PLANS.find((p) => p.id === 'monthly');
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
