import { redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import WeekStrip from '@/components/app/WeekStrip';
import HabitRow from '@/components/app/HabitRow';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { formatLongDate, parseDateKey, toDateKey, weekDays } from '@/lib/dates';
import { programForPlan, scheduleProgramForUser } from '@/lib/schedule';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Today | Emelifts' };

export default async function TodayPage({ searchParams }) {
  let user = await getSessionUser();
  if (!user) redirect('/login');
  if (user.role === 'coach') redirect('/coach');
  if (!hasAppAccess(user)) redirect('/app/waiting');

  const membership = user.memberships[0];
  if (membership && !membership.programId) {
    const program = await programForPlan(membership.plan);
    if (program?.workouts?.length) {
      await scheduleProgramForUser({
        userId: user.id,
        programId: program.id,
      });
      user = await getSessionUser();
    }
  }

  const params = await searchParams;
  const selected = params?.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
    ? params.date
    : toDateKey();
  const days = weekDays(parseDateKey(selected));
  const weekKeys = days.map((d) => d.key);

  const programId = user.memberships[0]?.programId;
  const sessions = programId
    ? await prisma.scheduledSession.findMany({
        where: {
          userId: user.id,
          date: { in: weekKeys },
          workout: { programId },
        },
        include: { workout: { include: { exercises: { include: { movement: true } } } } },
      })
    : [];

  const todaySessions = sessions.filter((s) => s.date === selected);
  const scheduledKeys = sessions.map((s) => s.date);
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const planned = sessions.length;

  const habits = await prisma.habit.findMany({ where: { userId: user.id } });
  const habitLogs = await prisma.habitLog.findMany({
    where: { userId: user.id, date: selected },
  });
  const doneIds = new Set(habitLogs.map((h) => h.habitId));

  const unread = await prisma.message.count({
    where: { toUserId: user.id, readAt: null },
  });

  return (
    <AppShell title={user.name.split(' ')[0]} subtitle="This week">
      <WeekStrip days={days} selected={selected} scheduledKeys={scheduledKeys} />
      <p className="mb-1 text-[13px] text-[#6e6e73]">{formatLongDate(selected)}</p>
      <p className="mb-4 text-[13px] text-[#6e6e73] md:text-[15px]">
        {completed} of {planned} sessions logged this week
        {unread ? ` · ${unread} new message${unread > 1 ? 's' : ''}` : ''}
      </p>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
        <div>
          {todaySessions.length === 0 ? (
            <div className="rounded-[22px] bg-[#f5f5f7] px-5 py-8 md:px-8 md:py-10">
              <p className="text-[19px] font-semibold text-[#1d1d1f] md:text-[24px]">Rest day</p>
              <p className="mt-2 text-[15px] leading-snug text-[#6e6e73] md:text-[17px]">
                Walk, eat well, sleep. Your next lift is on a dotted day this week.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => (
                <a
                  key={session.id}
                  href={`/app/workout/${session.id}`}
                  className="block rounded-[22px] bg-[#1d1d1f] px-5 py-6 text-white md:px-8 md:py-8"
                >
                  <p className="text-[12px] uppercase tracking-[0.06em] text-white/50">
                    {session.status === 'completed' ? 'Completed' : 'Today’s workout'}
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold md:text-[28px]">{session.workout.name}</h2>
                  <p className="mt-2 text-[14px] text-white/65 md:text-[16px]">
                    {session.workout.durationMin} min · {session.workout.exercises.length}{' '}
                    movements
                  </p>
                  <ul className="mt-4 space-y-1 text-[13px] text-white/70">
                    {session.workout.exercises.map((ex) => (
                      <li key={ex.id}>{ex.name}</li>
                    ))}
                  </ul>
                  <span className="btn-primary-dark mt-5 pointer-events-none">
                    {session.status === 'completed' ? 'Review log' : 'Start'}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
            Habits
          </h2>
          <div className="space-y-2">
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} date={selected} done={doneIds.has(habit.id)} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
