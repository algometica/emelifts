import { NextResponse } from 'next/server';
import { grantAppAccess, pauseAppAccess } from '@/lib/access';

export const runtime = 'nodejs';

function customData(data) {
  return data?.customData || data?.custom_data || {};
}

function eventEmail(data) {
  const custom = customData(data);
  return String(
    custom.email ||
      data?.customer?.email ||
      data?.email ||
      ''
  )
    .trim()
    .toLowerCase();
}

async function handleEvent(eventType, data) {
  const custom = customData(data);
  const email = eventEmail(data);
  const name = custom.name || data?.customer?.name || '';
  const plan = custom.plan || 'monthly';
  const customerId = data?.customerId || data?.customer_id || data?.customer?.id || '';
  const subscriptionId =
    (String(eventType).includes('subscription') && data?.id) ||
    data?.subscriptionId ||
    data?.subscription_id ||
    '';
  const transactionId =
    (String(eventType).includes('transaction') && data?.id) ||
    data?.transactionId ||
    '';

  if (
    eventType === 'transaction.completed' ||
    eventType === 'subscription.activated' ||
    eventType === 'subscription.created'
  ) {
    if (!email) {
      console.error('Paddle grant skipped: no email on event', eventType);
      return;
    }
    await grantAppAccess({
      email,
      name,
      plan,
      paddleCustomerId: customerId,
      paddleSubscriptionId: subscriptionId,
      paddleTransactionId: transactionId,
    });
    return;
  }

  if (
    eventType === 'subscription.canceled' ||
    eventType === 'subscription.past_due' ||
    eventType === 'subscription.paused'
  ) {
    await pauseAppAccess({ email, paddleSubscriptionId: subscriptionId || data?.id });
  }
}

export async function POST(request) {
  const raw = await request.text();
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret required' }, { status: 503 });
  }

  try {
    const { Paddle, Environment } = await import('@paddle/paddle-node-sdk');
    const paddle = new Paddle(process.env.PADDLE_API_KEY || 'unused', {
      environment:
        process.env.PADDLE_ENV === 'production'
          ? Environment.production
          : Environment.sandbox,
    });
    const event = await paddle.webhooks.unmarshal(
      raw,
      secret,
      request.headers.get('paddle-signature') || ''
    );
    await handleEvent(event.eventType || event.event_type, event.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Paddle webhook verify failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
