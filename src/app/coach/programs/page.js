import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import CoachShell from '@/components/coach/CoachShell';
import ProgramStudio from '@/components/coach/ProgramStudio';

export const metadata = { title: 'Programs | Emelifts' };

export default async function ProgramsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isCoach(user)) redirect('/app');

  const programs = await prisma.program.findMany({
    include: {
      workouts: {
        where: { userId: null },
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
      subtitle="This is the master plan. Later weeks copy week 1 until you customize them. Send to all keeps each client’s start date. Open a client to change one week for them only."
    >
      <ProgramStudio programs={programs} members={members} counts={counts} />
    </CoachShell>
  );
}
