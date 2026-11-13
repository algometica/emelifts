import { notFound, redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import {
  coachActivateMember,
  coachAssignProgram,
  coachPauseMember,
} from '@/app/actions';
import MessageForm from '@/components/app/MessageForm';
import MessageList from '@/components/app/MessageList';
import CoachShell from '@/components/coach/CoachShell';
import ClientWeekStudio from '@/components/coach/ClientWeekStudio';
import { toDateKey } from '@/lib/dates';
import { isId } from '@/lib/safe';
import { planName, weeksForPlan } from '@/lib/plans';

export default async function ClientPage({ params }) {
  const coach = await getSessionUser();
  if (!coach) redirect('/login');
  if (!isCoach(coach)) redirect('/app');
  const { id } = await params;
  if (!isId(id)) notFound();

  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: { orderBy: { createdAt: 'desc' }, take: 1 },
      scheduledSessions: {
        include: { workout: true },
        orderBy: { date: 'asc' },
      },
    },
  });
  if (!member || member.role !== 'member') notFound();

  const programs = await prisma.program.findMany({ include: { workouts: true } });
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromUserId: coach.id, toUserId: member.id },
        { fromUserId: member.id, toUserId: coach.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  const membership = member.memberships[0];
  const program = membership?.programId
    ? await prisma.program.findUnique({
        where: { id: membership.programId },
        include: {
          workouts: {
            where: { OR: [{ userId: null }, { userId: member.id }] },
            include: { exercises: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
    : null;
  const visibleSessions = member.scheduledSessions.filter(
    (s) => !membership?.programId || s.workout.programId === membership.programId
  );
  const upcoming = visibleSessions.filter((s) => s.status === 'scheduled').slice(0, 12);
  const paused = membership?.status === 'paused' || membership?.status === 'pending';

  return (
    <CoachShell title={member.name} subtitle={`${member.email} · ${planName(membership?.plan)}`}>
      <div className="mb-6">
        {paused ? (
          <form action={coachActivateMember.bind(null, member.id)}>
            <button className="btn-primary text-[14px]">Turn access on</button>
          </form>
        ) : (
          <form action={coachPauseMember.bind(null, member.id)}>
            <button className="btn-secondary">Pause access</button>
          </form>
        )}
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-[17px] font-semibold">Calendar</h2>
          <form action={coachAssignProgram} className="mt-4 grid gap-3 md:grid-cols-3">
            <input type="hidden" name="userId" value={member.id} />
            <select name="programId" className="field" defaultValue={membership?.programId || ''}>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              defaultValue={
                membership?.startDate ? toDateKey(membership.startDate) : toDateKey()
              }
              className="field"
            />
            <input type="hidden" name="weeks" value={membership?.plan === 'wedding' ? 12 : membership?.plan === 'challenge' ? 6 : 4} />
            <button className="btn-primary">Send this calendar</button>
          </form>
          <p className="mt-2 text-[13px] text-[#6e6e73]">
            Start date is this client’s week 1. Sending again keeps that date unless you change it.
          </p>
          <ul className="mt-4 divide-y text-[14px]">
            {upcoming.length === 0 ? (
              <li className="py-2 text-[#6e6e73]">No upcoming sessions.</li>
            ) : (
              upcoming.map((s) => (
                <li key={s.id} className="flex justify-between py-2">
                  <span>
                    {s.date} · {s.workout.name}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {program ? (
          <ClientWeekStudio
            program={program}
            userId={member.id}
            weeks={weeksForPlan(membership?.plan) || 12}
          />
        ) : null}

        <section className="card">
          <h2 className="text-[17px] font-semibold">Message</h2>
          <div className="mt-3 max-h-80 overflow-y-auto">
            <MessageList
              currentUserId={coach.id}
              messages={messages.map((m) => ({
                id: m.id,
                fromUserId: m.fromUserId,
                body: m.body,
                edited: Boolean(m.editedAt),
                createdAt: m.createdAt.toISOString(),
                when: m.createdAt.toLocaleString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                }),
              }))}
            />
          </div>
          <div className="mt-4">
            <MessageForm toUserId={member.id} placeholder="Write a note" />
          </div>
        </section>
      </div>
    </CoachShell>
  );
}
