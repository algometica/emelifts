import { redirect } from 'next/navigation';
import LoginForm from '@/components/app/LoginForm';
import { getSessionUser, isCoach } from '@/lib/session';

export const metadata = { title: 'Log in | Emelifts' };

export default async function LoginPage({ searchParams }) {
  const user = await getSessionUser();
  const params = await searchParams;
  if (isCoach(user)) redirect('/coach');
  if (user) redirect('/app');
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5f7] px-5 py-16">
      <div className="card w-full max-w-[400px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <p className="text-[13px] font-medium text-[#6e6e73]">Emelifts</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
          Log in
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
          Email and password from when you enrolled.
        </p>
        <LoginForm nextPath={params?.next} />
      </div>
    </div>
  );
}
