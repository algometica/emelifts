import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/app/LoginForm';

export const metadata = { title: 'Log in | Emelifts' };

export default async function LoginPage({ searchParams }) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) {
    redirect(session.user.role === 'coach' ? '/coach' : '/app');
  }
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-5 py-16">
      <div className="w-full max-w-[400px] rounded-[22px] border border-black/[0.08] bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <p className="text-[13px] font-medium text-[#6e6e73]">Emelifts</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
          Welcome back
        </h1>
        <p className="mt-2 text-[15px] text-[#6e6e73]">
          Log in to this week’s plan. Same account on any phone or laptop.
        </p>
        <LoginForm nextPath={params?.next} />
      </div>
    </div>
  );
}
