import Link from 'next/link';

export const metadata = { title: 'Payment received | Emelifts' };

export default function EnrollThanks() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-[28px] font-semibold tracking-tight">Payment received</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#6e6e73]">
          Log in with the email and password you just chose.
        </p>
        <Link href="/login" className="btn-primary mt-8">
          Log in
        </Link>
      </div>
    </div>
  );
}
