import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { coachFulfillEnrollment, coachInviteMember } from '@/app/actions';
import CoachShell from '@/components/coach/CoachShell';
import { planName } from '@/lib/plans';

export const metadata = { title: 'Clients | Emelifts' };

function memberStatus(membership) {
  if (!membership) return 'No access';
  if (membership.status === 'paused') return 'Paused';
  if (membership.status === 'pending') return 'Pending';
  if (membership.status === 'complimentary') return 'Complimentary';
  if (membership.paddleCustomerId) return 'Paid';
  return 'Active';
}

export default async function CoachHome() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isCoach(user)) redirect('/app');

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
    <CoachShell title="Clients">
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
                    {planName(membership?.plan)}
                    <span className="pill ml-2">{memberStatus(membership)}</span>
                  </p>
                </div>
                <p className="text-[13px] text-[#6e6e73]">
                  {done} logged
                </p>
              </a>
            </li>
          );
        })}
      </ul>
      {members.length === 0 ? (
        <p className="text-[15px] text-[#6e6e73]">No clients yet.</p>
      ) : null}

      <details className="mt-8">
        <summary className="btn-secondary">
          Add a client without charging
        </summary>
        <form action={coachInviteMember} className="card mt-3 grid gap-3 md:grid-cols-2">
          <p className="text-[14px] leading-relaxed text-[#6e6e73] md:col-span-2">
            Creates a login and calendar. No Paddle charge.
          </p>
          <input name="name" placeholder="Name" required className="field" />
          <input name="email" type="email" placeholder="Email" required className="field" />
          <input
            name="password"
            type="password"
            placeholder="Password you will tell them"
            required
            minLength={8}
            maxLength={200}
            className="field"
          />
          <select name="plan" defaultValue="monthly" className="field">
            <option value="monthly">Monthly calendar</option>
            <option value="challenge">6 week calendar</option>
            <option value="wedding">Wedding calendar</option>
          </select>
          <button type="submit" className="btn-primary md:col-span-2">
            Add client
          </button>
        </form>
      </details>

      {enrollments.length > 0 ? (
        <details className="mt-4">
          <summary className="btn-secondary">
            Waiting on payment ({enrollments.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {enrollments.map((e) => (
              <li key={e.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-[13px] text-[#6e6e73]">
                    {e.email} · {planName(e.plan)}
                  </p>
                </div>
                <form action={coachFulfillEnrollment.bind(null, e.id)}>
                  <button type="submit" className="btn-secondary">
                    Unlock anyway
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </CoachShell>
  );
}
