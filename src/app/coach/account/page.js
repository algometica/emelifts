import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import CoachShell from '@/components/coach/CoachShell';
import ChangePasswordForm from '@/components/app/ChangePasswordForm';

export const metadata = { title: 'Account | Emelifts' };

export default async function CoachAccountPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isCoach(user)) redirect('/app');

  return (
    <CoachShell title="Account" subtitle={user.email}>
      <ChangePasswordForm />
    </CoachShell>
  );
}
