import { redirect } from 'next/navigation';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { signOutAction } from '@/app/sign-out';
import WaitingRefresh from '@/components/app/WaitingRefresh';

export const dynamic = 'force-dynamic';

export default async function WaitingPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (hasAppAccess(user)) redirect('/app');

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-[28px] font-semibold tracking-tight">Payment is confirming</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#6e6e73]">
          Your login works. This week’s calendar opens as soon as Paddle confirms
          the payment. That usually takes a few seconds.
        </p>
        <WaitingRefresh />
        <form action={signOutAction} className="mt-8">
          <button type="submit" className="btn-secondary">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
