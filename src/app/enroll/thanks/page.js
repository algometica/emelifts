import Link from 'next/link';

export const metadata = { title: 'You are in | Emelifts' };

export default function EnrollThanks() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-[28px] font-semibold tracking-tight">You are in</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#6e6e73]">
          Log in with the email and password you chose at checkout. If the calendar
          is not ready yet, you will see a short waiting screen until payment
          confirms.
        </p>
        <Link href="/login" className="btn-primary mt-8">
          Log in
        </Link>
      </div>
    </div>
  );
}
