import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const WORKOUTS = [
  {
    name: 'Lower A · Squat focus',
    durationMin: 45,
    dayOffset: 0,
    notes: 'Warm up 5 minutes. Leave 1-2 reps in the tank.',
    exercises: [
      { name: 'Goblet squat', sets: 4, reps: '8-10', restSec: 90 },
      { name: 'Romanian deadlift', sets: 3, reps: '8-10', restSec: 90 },
      { name: 'Reverse lunge', sets: 3, reps: '10/side', restSec: 75 },
      { name: 'Glute bridge', sets: 3, reps: '12-15', restSec: 60 },
      { name: 'Calf raise', sets: 3, reps: '12-15', restSec: 45 },
    ],
  },
  {
    name: 'Upper A · Push',
    durationMin: 40,
    dayOffset: 2,
    notes: 'Shoulders packed. Video form if anything feels off.',
    exercises: [
      { name: 'Floor press', sets: 4, reps: '8-10', restSec: 90 },
      { name: '1-arm row', sets: 3, reps: '8-10', restSec: 75 },
      { name: 'Overhead press', sets: 3, reps: '8-10', restSec: 75 },
      { name: 'Lateral raise', sets: 3, reps: '12-15', restSec: 45 },
      { name: 'Dead bug', sets: 3, reps: '8/side', restSec: 45 },
    ],
  },
  {
    name: 'Lower B · Hinge focus',
    durationMin: 45,
    dayOffset: 4,
    notes: 'Hinge from the hips. Soft knees.',
    exercises: [
      { name: 'Dumbbell RDL', sets: 4, reps: '8-10', restSec: 90 },
      { name: 'Split squat', sets: 3, reps: '8/side', restSec: 75 },
      { name: 'Hip thrust', sets: 3, reps: '10-12', restSec: 75 },
      { name: 'Side-lying abduction', sets: 2, reps: '15/side', restSec: 40 },
      { name: 'Dead bug', sets: 3, reps: '8/side', restSec: 45 },
    ],
  },
  {
    name: 'Upper B · Pull',
    durationMin: 40,
    dayOffset: 6,
    notes: 'Own the last 2 reps. No rushing rest.',
    exercises: [
      { name: 'Chest-supported row', sets: 4, reps: '8-10', restSec: 90 },
      { name: 'Push-up or incline push-up', sets: 3, reps: '8-12', restSec: 75 },
      { name: 'Rear delt fly', sets: 3, reps: '12-15', restSec: 45 },
      { name: 'Biceps curl', sets: 3, reps: '10-12', restSec: 45 },
      { name: 'Side plank', sets: 3, reps: '20-30s', restSec: 40 },
    ],
  },
];

const PROGRAMS = [
  {
    planKey: 'monthly',
    name: 'Lift with EME',
    description: 'Monthly strength. Four lifting days each week.',
  },
  {
    planKey: 'challenge',
    name: '6 Week Challenge',
    description: 'Six-week program. Only challenge clients see this calendar.',
  },
  {
    planKey: 'wedding',
    name: '12 Week Wedding Prep',
    description: 'Bridal prep. Only wedding clients see this calendar.',
  },
];

async function fillWorkouts(programId) {
  const existing = await prisma.workout.count({ where: { programId } });
  if (existing) return;

  const names = [...new Set(WORKOUTS.flatMap((w) => w.exercises.map((e) => e.name)))];
  const movements = {};
  for (const name of names) {
    movements[name] = await prisma.movement.upsert({
      where: { name },
      update: {},
      create: { name, youtubeUrl: '', notes: '' },
    });
  }

  for (const [i, w] of WORKOUTS.entries()) {
    await prisma.workout.create({
      data: {
        programId,
        name: w.name,
        durationMin: w.durationMin,
        notes: w.notes,
        dayOffset: w.dayOffset,
        sortOrder: i,
        exercises: {
          create: w.exercises.map((ex, idx) => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            sortOrder: idx,
            restSec: ex.restSec,
            movementId: movements[ex.name].id,
          })),
        },
      },
    });
  }
}

async function ensurePrograms() {
  for (const row of PROGRAMS) {
    let program = await prisma.program.findUnique({ where: { planKey: row.planKey } });
    if (!program) {
      const orphan = await prisma.program.findFirst({
        where: { OR: [{ planKey: '' }, { planKey: row.planKey }] },
      });
      if (orphan && row.planKey === 'monthly') {
        program = await prisma.program.update({
          where: { id: orphan.id },
          data: row,
        });
      } else {
        program = await prisma.program.create({ data: row });
      }
    }
    await fillWorkouts(program.id);
  }
}

async function main() {
  const reset = process.env.SEED_RESET === '1';
  const coachEmail = (process.env.COACH_EMAIL || 'em@emelifts.com').toLowerCase();
  const coachPassword = process.env.COACH_PASSWORD || 'emelifts';

  if (process.env.NODE_ENV === 'production' && coachPassword === 'emelifts') {
    throw new Error('Set COACH_PASSWORD before seeding production.');
  }

  if (reset) {
    await prisma.setLog.deleteMany();
    await prisma.scheduledSession.deleteMany();
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.message.deleteMany();
    await prisma.progressPhoto.deleteMany();
    await prisma.bodyStat.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.program.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.magicLink.deleteMany();
    await prisma.user.deleteMany();
  }

  const passwordHash = await bcrypt.hash(coachPassword, 10);
  const coach = await prisma.user.upsert({
    where: { email: coachEmail },
    update: { role: 'coach', name: 'Em' },
    create: {
      email: coachEmail,
      name: 'Em',
      role: 'coach',
      passwordHash,
    },
  });

  if (reset) {
    await prisma.user.update({
      where: { id: coach.id },
      data: { passwordHash },
    });
  }

  await ensurePrograms();
  console.log(`Coach ready: ${coachEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
