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

export async function startDateForUser(userId) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  if (membership?.startDate) return toDateKey(membership.startDate);
  const first = await prisma.scheduledSession.findFirst({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { date: true },
  });
  return first?.date || toDateKey();
}

export function workoutsForProgramWeek(workouts, week, userId) {
  const list = workouts || [];
  const clientWeek = list.filter(
    (workout) => workout.userId === userId && (workout.weekIndex || 0) === week
  );
  if (clientWeek.length) return clientWeek;
  const masterWeek = list.filter(
    (workout) => !workout.userId && (workout.weekIndex || 0) === week
  );
  if (masterWeek.length) return masterWeek;
  return list.filter((workout) => !workout.userId && (workout.weekIndex || 0) === 0);
}

export async function cloneWeekWorkouts({ programId, toWeek, userId = null }) {
  const already = await prisma.workout.count({
    where: { programId, weekIndex: toWeek, userId },
  });
  if (already) return { cloned: false };
  let source = await prisma.workout.findMany({
    where: { programId, weekIndex: toWeek, userId: null },
    include: { exercises: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!source.length) {
    source = await prisma.workout.findMany({
      where: { programId, weekIndex: 0, userId: null },
      include: { exercises: { orderBy: { sortOrder: 'asc' } } },
    });
  }
  for (const workout of source) {
    await prisma.workout.create({
      data: {
        programId,
        userId,
        name: workout.name,
        durationMin: workout.durationMin,
        notes: workout.notes,
        dayOffset: workout.dayOffset,
        weekIndex: toWeek,
        sortOrder: workout.sortOrder,
        exercises: {
          create: workout.exercises.map((exercise) => ({
            name: exercise.name,
            sortOrder: exercise.sortOrder,
            sets: exercise.sets,
            reps: exercise.reps,
            restSec: exercise.restSec,
            notes: exercise.notes,
          })),
        },
      },
    });
  }
  return { cloned: true, count: source.length };
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

  const completed = await prisma.scheduledSession.findMany({
    where: { userId, status: 'completed' },
    select: { date: true },
  });
  const completedDates = new Set(completed.map((session) => session.date));

  await prisma.scheduledSession.deleteMany({
    where: { userId, status: 'scheduled', workout: { programId } },
  });

  const latest = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  if (latest) {
    await prisma.membership.update({
      where: { id: latest.id },
      data: {
        programId: program.id,
        startDate: new Date(`${startDate}T00:00:00`),
      },
    });
  }

  const start = new Date(`${startDate}T00:00:00`);
  start.setDate(start.getDate() - start.getDay());

  for (let week = 0; week < length; week += 1) {
    const workouts = workoutsForProgramWeek(program.workouts, week, userId);
    for (const workout of workouts) {
      const d = new Date(start);
      d.setDate(start.getDate() + week * 7 + workout.dayOffset);
      const date = toDateKey(d);
      if (completedDates.has(date)) continue;
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
