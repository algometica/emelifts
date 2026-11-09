import { notFound, redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import {
  coachActivateMember,
  coachAssignProgram,
  coachPauseMember,
} from '@/app/actions';
import MessageForm from '@/components/app/MessageForm';
import CoachShell from '@/components/coach/CoachShell';
import { toDateKey } from '@/lib/dates';
import { isId } from '@/lib/safe';

export default async function ClientPage({ params }) {
  const coach = await getSessionUser();
  if (!isCoach(coach)) redirect('/login');
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
      bodyStats: { orderBy: { createdAt: 'desc' }, take: 6 },
      habitLogs: true,
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
  const visibleSessions = member.scheduledSessions.filter(
    (s) => !membership?.programId || s.workout.programId === membership.programId
  );

  return (
    <CoachShell
      title={member.name}
      subtitle={`${member.email} · ${membership?.plan ?? 'no plan'} · ${membership?.status ?? 'none'}${
        membership?.programId
          ? ` · ${programs.find((p) => p.id === membership.programId)?.name ?? 'program'}`
          : ''
      }`}
    >
      <div className="mb-6 flex gap-2">
        <form action={coachActivateMember.bind(null, member.id)}>
          <button className="btn-primary text-[14px]">Activate access</button>
        </form>
        <form action={coachPauseMember.bind(null, member.id)}>
          <button className="btn-secondary">Pause access</button>
        </form>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-[17px] font-semibold">Put a program on her calendar</h2>
          <p className="mt-1 text-[14px] text-[#6e6e73]">
            Replaces upcoming sessions. Completed logs stay. Paid Paddle plan does not change.
          </p>
          <form action={coachAssignProgram} className="mt-4 grid gap-3 md:grid-cols-4">
            <input type="hidden" name="userId" value={member.id} />
            <select name="programId" className="field">
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input type="date" name="startDate" defaultValue={toDateKey()} className="field" />
            <input type="number" name="weeks" defaultValue={4} min={1} max={12} className="field" />
            <button className="btn-primary">Schedule</button>
          </form>
        </section>

        <section className="card">
          <h2 className="text-[17px] font-semibold">Calendar</h2>
          <ul className="mt-3 divide-y text-[14px]">
            {visibleSessions.map((s) => (
              <li key={s.id} className="flex justify-between py-2">
                <span>
                  {s.date} · {s.workout.name}
                </span>
                <span className="text-[#6e6e73]">{s.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="text-[17px] font-semibold">Messages</h2>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {messages.map((m) => (
              <p key={m.id} className="text-[14px]">
                <span className="font-medium">{m.fromUserId === coach.id ? 'You' : member.name}: </span>
                {m.body}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <MessageForm toUserId={member.id} placeholder={`Message ${member.name}`} />
          </div>
        </section>

        <section className="card">
          <h2 className="text-[17px] font-semibold">Weight log</h2>
          <ul className="mt-3 text-[14px] text-[#6e6e73]">
            {member.bodyStats.map((s) => (
              <li key={s.id}>
                {s.date}
                {s.weight != null ? ` · ${s.weight} kg` : ''}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </CoachShell>
  );
}
