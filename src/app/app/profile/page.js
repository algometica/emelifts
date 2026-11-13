import { redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { signOutAction } from '@/app/sign-out';
import ChangePasswordForm from '@/components/app/ChangePasswordForm';
import { planName } from '@/lib/plans';

export const metadata = { title: 'Profile | Emelifts' };

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!hasAppAccess(user)) redirect('/app/waiting');
  const membership = user.memberships[0];

  return (
    <AppShell title="Profile" subtitle="Account">
      <div className="rounded-[22px] bg-[#f5f5f7] p-5">
        <p className="text-[19px] font-semibold">{user.name}</p>
        <p className="mt-1 text-[15px] text-[#6e6e73]">{user.email}</p>
        <p className="mt-4 text-[14px] text-[#6e6e73]">
          {membership?.program?.name || planName(membership?.plan)}
        </p>
      </div>
      <ChangePasswordForm />
      <p className="mt-6 text-[14px] leading-relaxed text-[#6e6e73]">
        Add this site to your home screen for a full-screen app.
      </p>
      <form action={signOutAction} className="mt-8">
        <button type="submit" className="btn-secondary">
          Sign out
        </button>
      </form>
    </AppShell>
  );
}
