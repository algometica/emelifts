import { notFound, redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import WorkoutLogger from '@/components/app/WorkoutLogger';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export default async function WorkoutPage({ params }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!hasAppAccess(user)) redirect('/app/waiting');

  const { id } = await params;
  const session = await prisma.scheduledSession.findFirst({
    where: { id, userId: user.id },
    include: {
      workout: {
        include: { exercises: { orderBy: { sortOrder: 'asc' }, include: { movement: true } } },
      },
      setLogs: true,
    },
  });
  if (!session) notFound();
  const programId = user.memberships[0]?.programId;
  if (programId && session.workout.programId !== programId) notFound();

  const previous = await prisma.scheduledSession.findMany({
    where: {
      userId: user.id,
      workoutId: session.workoutId,
      status: 'completed',
      NOT: { id: session.id },
    },
    include: { setLogs: true },
    orderBy: { date: 'desc' },
    take: 1,
  });

  const prevLogs = previous[0]?.setLogs ?? [];
  const exercises = session.workout.exercises.map((ex) => ({
    ...ex,
    setLogs: session.setLogs.filter((l) => l.exerciseId === ex.id),
    previous: prevLogs
      .filter((l) => l.exerciseId === ex.id)
      .sort((a, b) => a.setIndex - b.setIndex),
  }));

  return (
    <AppShell title={session.workout.name} subtitle={`${session.workout.durationMin} min`}>
      <p className="mb-4">
        <a href="/app" className="text-[14px] text-[#0066cc]">
          ← Today
        </a>
      </p>
      <WorkoutLogger session={{ ...session, workout: { ...session.workout, exercises } }} />
    </AppShell>
  );
}
