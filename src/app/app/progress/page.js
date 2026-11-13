import { redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import HabitGrid from '@/components/app/HabitGrid';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { addBodyStat } from '@/app/actions';
import { lastDays, streakFrom, toDateKey, weekDays } from '@/lib/dates';

export const metadata = { title: 'Progress | Emelifts' };

export default async function ProgressPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!hasAppAccess(user)) redirect('/app/waiting');

  const todayKey = toDateKey();
  const days = weekDays();
  const fromKey = lastDays(60)[0].key;

  const [stats, completed, habits, habitLogs] = await Promise.all([
    prisma.bodyStat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.scheduledSession.count({
      where: { userId: user.id, status: 'completed' },
    }),
    prisma.habit.findMany({ where: { userId: user.id } }),
    prisma.habitLog.findMany({
      where: { userId: user.id, date: { gte: fromKey } },
    }),
  ]);

  const doneSet = new Set(habitLogs.filter((l) => l.completed).map((l) => `${l.habitId}:${l.date}`));
  const rows = habits.map((habit) => ({
    ...habit,
    streak: streakFrom(
      habitLogs.filter((l) => l.habitId === habit.id && l.completed).map((l) => l.date),
      todayKey
    ),
  }));
  const checksThisWeek = habitLogs.filter((l) => l.completed && l.date >= days[0].key).length;
  const possibleThisWeek = habits.length * 7;

  return (
    <AppShell title="Progress" subtitle="Your week">
      <p className="mb-5 text-[15px] text-[#6e6e73]">
        {completed} workout{completed === 1 ? '' : 's'} done
        {habits.length
          ? ` · ${checksThisWeek} of ${possibleThisWeek} habits this week`
          : ''}
      </p>

      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
        Habits
      </h2>
      <div className="mb-8 rounded-[22px] bg-[#f5f5f7] p-4 md:p-5">
        <HabitGrid habits={rows} days={days} doneSet={doneSet} todayKey={todayKey} />
      </div>

      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
        Weight
      </h2>
      <form action={addBodyStat} className="mb-4 flex gap-2">
        <input
          name="weight"
          inputMode="decimal"
          placeholder="Weight"
          className="h-11 flex-1 rounded-xl border border-black/[0.1] px-3"
        />
        <button type="submit" className="btn-primary px-4">
          Save
        </button>
      </form>
      <ul className="space-y-2 text-[14px] text-[#6e6e73]">
        {stats.map((s) => (
          <li key={s.id}>
            {s.date}
            {s.weight != null ? ` · ${s.weight}` : ''}
            {s.notes ? ` · ${s.notes}` : ''}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
