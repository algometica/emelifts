'use client';

import { useState } from 'react';
import { startPaddleCheckout } from '@/app/actions';

export default function PaddleCheckout({ plans, selected, clientToken, sandbox, envReady }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const configured = Boolean(clientToken && envReady);

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

    if (!envReady) {
      setError('PADDLE_ENV must be sandbox or production.');
      return;
    }
    if (!result?.priceId || !clientToken) {
      setError('Paddle is not configured yet. Add your price IDs in .env.');
      return;
    }

    const environment = sandbox ? 'sandbox' : 'production';
    const { initializePaddle } = await import('@paddle/paddle-js');
    const paddle = await initializePaddle({
      token: clientToken,
      environment,
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
        displayMode: 'overlay',
        variant: 'one-page',
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
      {plans.length === 1 ? (
        <>
          <input type="hidden" name="plan" value={plans[0].id} />
          <p className="rounded-2xl bg-[#f5f5f7] px-4 py-3 text-[15px] text-[#1d1d1f]">
            {plans[0].name}
            <span className="mt-1 block text-[13px] text-[#6e6e73]">{plans[0].price}</span>
          </p>
        </>
      ) : (
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
      )}
      <label className="flex items-start gap-3 text-[14px] leading-snug text-[#6e6e73]">
        <input name="terms" type="checkbox" required className="mt-1" />
        <span>
          I understand this is app access, not in-person coaching.
        </span>
      </label>
      {error ? <p className="text-[14px] text-[#9B3B1A]">{error}</p> : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Opening checkout…' : 'Pay'}
      </button>
      {!configured ? (
        <p className="text-center text-[13px] text-[#6e6e73]">Checkout is not ready yet.</p>
      ) : null}
    </form>
  );
}
