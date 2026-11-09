'use client';

import { useState } from 'react';
import { startPaddleCheckout } from '@/app/actions';

export default function PaddleCheckout({ plans, selected, clientToken, sandbox }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const configured = Boolean(clientToken);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await startPaddleCheckout(form);
    setPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (!result?.priceId || !clientToken) {
      setError('Paddle is not configured yet. Add your price IDs in .env.');
      return;
    }

    const { initializePaddle } = await import('@paddle/paddle-js');
    const paddle = await initializePaddle({
      token: clientToken,
      environment: sandbox ? 'sandbox' : 'production',
    });
    if (!paddle) {
      setError('Could not start checkout.');
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId: result.priceId, quantity: 1 }],
      customer: { email: result.email },
      customData: {
        email: result.email,
        name: result.name,
        plan: result.plan,
      },
      settings: {
        successUrl: `${window.location.origin}/enroll/thanks`,
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-[13px] font-medium">
        Name
        <input name="name" required maxLength={80} className="field mt-1" />
      </label>
      <label className="block text-[13px] font-medium">
        Email
        <input name="email" type="email" required maxLength={254} className="field mt-1" />
      </label>
      <label className="block text-[13px] font-medium">
        Password for the app
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          maxLength={200}
          className="field mt-1"
        />
      </label>
      <label className="block text-[13px] font-medium">
        Plan
        <select name="plan" defaultValue={selected} className="field mt-1">
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}: {p.price}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-3 text-[14px] leading-snug text-[#6e6e73]">
        <input name="terms" type="checkbox" required className="mt-1" />
        <span>
          I understand this is software access to Emelifts. Logging workouts and opening
          the calendar counts as delivery. Access is not refunded after activation except
          as required by law.
        </span>
      </label>
      {error ? <p className="text-[14px] text-[#9B3B1A]">{error}</p> : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Opening checkout…' : configured ? 'Continue to pay' : 'Save request (Paddle keys needed)'}
      </button>
      {!configured ? (
        <p className="text-center text-[13px] text-[#6e6e73]">
          Checkout opens Paddle once NEXT_PUBLIC_PADDLE_CLIENT_TOKEN and price IDs are set.
          Until then this saves a pending enrollment.
        </p>
      ) : null}
    </form>
  );
}
