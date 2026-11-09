import Link from 'next/link';
import PaddleCheckout from '@/components/app/PaddleCheckout';
import { PLANS } from '@/lib/plans';

export const metadata = { title: 'Enroll | Emelifts' };

export default async function EnrollPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.plan || 'monthly';
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
  const sandbox = process.env.PADDLE_ENV !== 'production';

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-5 py-16">
      <div className="card mx-auto w-full max-w-lg p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <Link href="/" className="text-[14px] text-[#0066cc]">
          Home
        </Link>
        <h1 className="mt-4 text-[32px] font-semibold tracking-tight">Join Emelifts</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
          Pay once or monthly. Your login is the email and password you set below.
          Checkout is Paddle. They handle tax and the card. Not Stripe.
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-[14px] text-[#6e6e73]">
          <li>Choose a plan and a password.</li>
          <li>Pay.</li>
          <li>Log in. Your calendar for that plan is waiting.</li>
        </ol>
        <PaddleCheckout
          plans={PLANS}
          selected={selected}
          clientToken={clientToken}
          sandbox={sandbox}
        />
        <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
          Already a member?{' '}
          <a href="/login" className="font-medium text-[#0066cc]">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
