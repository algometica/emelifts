import { prisma } from './prisma';
import { toDateKey } from './dates';
import { weeksForPlan } from './plans';

export async function programForPlan(planKey) {
  if (!planKey) return null;
  return prisma.program.findUnique({
    where: { planKey },
    include: { workouts: true },
  });
}

export async function scheduleProgramForUser({
  userId,
  programId,
  startDate = toDateKey(),
  weeks,
}) {
  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: { workouts: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!program?.workouts?.length) {
    return { error: 'Program has no workouts' };
  }

  const length = Number.isFinite(weeks) && weeks > 0 ? weeks : weeksForPlan(program.planKey);

  await prisma.scheduledSession.deleteMany({
    where: { userId, status: 'scheduled' },
  });

  const latest = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  if (latest) {
    await prisma.membership.update({
      where: { id: latest.id },
      data: { programId: program.id },
    });
  }

  const start = new Date(`${startDate}T00:00:00`);
  start.setDate(start.getDate() - start.getDay());

  for (let week = 0; week < length; week += 1) {
    for (const workout of program.workouts) {
      const d = new Date(start);
      d.setDate(start.getDate() + week * 7 + workout.dayOffset);
      const date = toDateKey(d);
      await prisma.scheduledSession.upsert({
        where: {
          userId_date_workoutId: { userId, date, workoutId: workout.id },
        },
        update: {},
        create: { userId, workoutId: workout.id, date },
      });
    }
  }

  return { ok: true, weeks: length };
}
