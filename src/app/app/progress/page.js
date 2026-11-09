import { redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { addBodyStat } from '@/app/actions';

export const metadata = { title: 'Progress | Emelifts' };

export default async function ProgressPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!hasAppAccess(user)) redirect('/app/waiting');

  const [stats, completed] = await Promise.all([
    prisma.bodyStat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.scheduledSession.count({
      where: { userId: user.id, status: 'completed' },
    }),
  ]);

  return (
    <AppShell title="Progress" subtitle="Your log">
      <p className="mb-6 text-[15px] text-[#6e6e73]">{completed} workouts completed</p>

      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
        Body weight
      </h2>
      <form action={addBodyStat} className="mb-4 flex gap-2">
        <input
          name="weight"
          inputMode="decimal"
          placeholder="kg"
          className="h-11 flex-1 rounded-xl border border-black/[0.1] px-3"
        />
        <input
          name="notes"
          placeholder="Note"
          className="h-11 flex-1 rounded-xl border border-black/[0.1] px-3"
        />
        <button type="submit" className="btn-primary px-4">
          Save
        </button>
      </form>
      <ul className="mb-8 space-y-2 text-[14px] text-[#6e6e73]">
        {stats.map((s) => (
          <li key={s.id}>
            {s.date}
            {s.weight != null ? ` · ${s.weight} kg` : ''}
            {s.notes ? ` · ${s.notes}` : ''}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
