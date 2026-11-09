import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import CoachShell from '@/components/coach/CoachShell';
import ProgramStudio from '@/components/coach/ProgramStudio';

export const metadata = { title: 'Programs | Emelifts' };

export default async function ProgramsPage() {
  const user = await getSessionUser();
  if (!isCoach(user)) redirect('/login');

  const programs = await prisma.program.findMany({
    include: {
      workouts: {
        include: { exercises: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  const members = await prisma.user.findMany({
    where: { role: 'member' },
    include: { memberships: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { name: 'asc' },
  });

  const counts = {};
  for (const program of programs) {
    const workoutIds = program.workouts.map((w) => w.id);
    counts[program.id] = workoutIds.length
      ? await prisma.user.count({
          where: {
            role: 'member',
            scheduledSessions: { some: { workoutId: { in: workoutIds } } },
          },
        })
      : 0;
  }

  return (
    <CoachShell
      title="Programs"
      subtitle="Pick a plan, pick a day, add the lifts. Clients on that plan see the same session."
    >
      <ProgramStudio programs={programs} members={members} counts={counts} />
    </CoachShell>
  );
}
