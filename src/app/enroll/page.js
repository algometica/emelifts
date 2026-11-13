import Link from 'next/link';
import PaddleCheckout from '@/components/app/PaddleCheckout';
import { PLANS } from '@/lib/plans';

export const metadata = { title: 'Enroll | Emelifts' };

export default async function EnrollPage({ searchParams }) {
  const params = await searchParams;
  const requested = String(params?.plan || 'wedding');
  const selected = ['monthly', 'challenge', 'wedding'].includes(requested)
    ? requested
    : 'wedding';
  const plans = PLANS.filter((plan) => plan.id === selected);
  const paddleEnv = process.env.PADDLE_ENV;
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
  const envReady = paddleEnv === 'sandbox' || paddleEnv === 'production';
  const sandbox = paddleEnv !== 'production';

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-5 py-16">
      <div className="card mx-auto w-full max-w-lg p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <Link href="/" className="btn-secondary btn-sm">
          Home
        </Link>
        <h1 className="mt-4 text-[32px] font-semibold tracking-tight">Join Emelifts</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
          Set a password, then pay. Use that email and password to log in.
        </p>
        <PaddleCheckout
          plans={plans}
          selected={selected}
          clientToken={clientToken}
          sandbox={sandbox}
          envReady={envReady}
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
