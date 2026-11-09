import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { coachFulfillEnrollment, coachInviteMember } from '@/app/actions';
import CoachShell from '@/components/coach/CoachShell';
import ChangePasswordForm from '@/components/app/ChangePasswordForm';

export const metadata = { title: 'Coach | Emelifts' };

function statusLabel(membership) {
  if (!membership) return 'No plan';
  if (!membership.paddleCustomerId && membership.status !== 'pending') {
    return 'Free access';
  }
  return membership.status;
}

export default async function CoachHome() {
  const user = await getSessionUser();
  if (!isCoach(user)) redirect('/login');

  const members = await prisma.user.findMany({
    where: { role: 'member' },
    include: {
      memberships: { orderBy: { createdAt: 'desc' }, take: 1 },
      scheduledSessions: { select: { status: true } },
    },
    orderBy: { name: 'asc' },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CoachShell
      title="Clients"
      subtitle="Paid members come in through Enroll. Invite is only for free access."
    >
      {enrollments.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
            Started checkout, not confirmed
          </h2>
          <ul className="space-y-2">
            {enrollments.map((e) => (
              <li key={e.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-[13px] text-[#6e6e73]">
                    {e.email} · {e.plan}
                  </p>
                </div>
                <form action={coachFulfillEnrollment.bind(null, e.id)}>
                  <button type="submit" className="btn-secondary">
                    Mark paid by hand
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card mb-8">
        <h2 className="text-[17px] font-semibold">Give free access</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">
          This does not create a Paddle customer or start billing. They get the app
          for free until they enroll and pay themselves. The menu only picks which
          calendar to load.
        </p>
        <form action={coachInviteMember} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Name" required className="field" />
          <input name="email" type="email" placeholder="Email" required className="field" />
          <input
            name="password"
            type="password"
            placeholder="Password they will use (8+)"
            required
            minLength={8}
            maxLength={200}
            className="field"
          />
          <select name="plan" defaultValue="complimentary" className="field">
            <option value="complimentary">Complimentary (no charge)</option>
            <option value="monthly">Monthly calendar, still free</option>
            <option value="challenge">6 week calendar, still free</option>
            <option value="wedding">Wedding calendar, still free</option>
          </select>
          <button type="submit" className="btn-primary md:col-span-2">
            Create free access
          </button>
        </form>
      </section>

      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
        {members.length} members
      </h2>
      <ul className="space-y-2">
        {members.map((m) => {
          const membership = m.memberships[0];
          const done = m.scheduledSessions.filter((s) => s.status === 'completed').length;
          return (
            <li key={m.id}>
              <a
                href={`/coach/clients/${m.id}`}
                className="card flex items-center justify-between hover:bg-[#fafafa]"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="mt-1 text-[13px] text-[#6e6e73]">
                    {m.email}
                    <span className="pill ml-2">{statusLabel(membership)}</span>
                    <span className="pill ml-1">{membership?.plan ?? 'none'}</span>
                  </p>
                </div>
                <p className="text-[13px] text-[#6e6e73]">
                  {done}/{m.scheduledSessions.length} logged
                </p>
              </a>
            </li>
          );
        })}
      </ul>
      <ChangePasswordForm />
    </CoachShell>
  );
}
