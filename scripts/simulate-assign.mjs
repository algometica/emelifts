import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { grantAppAccess } from '../src/lib/access.js';
import { scheduleProgramForUser } from '../src/lib/schedule.js';

const prisma = new PrismaClient();

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function calendarProgramIds(userId) {
  const sessions = await prisma.scheduledSession.findMany({
    where: { userId, status: 'scheduled' },
    include: { workout: true },
  });
  return [...new Set(sessions.map((s) => s.workout.programId))];
}

async function cleanup(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;
  await prisma.setLog.deleteMany({ where: { session: { userId: user.id } } });
  await prisma.scheduledSession.deleteMany({ where: { userId: user.id } });
  await prisma.habitLog.deleteMany({ where: { userId: user.id } });
  await prisma.habit.deleteMany({ where: { userId: user.id } });
  await prisma.membership.deleteMany({ where: { userId: user.id } });
  await prisma.enrollment.deleteMany({ where: { email } });
  await prisma.user.delete({ where: { id: user.id } });
}

async function main() {
  const stamp = Date.now();
  const weddingEmail = `sim-wedding-${stamp}@emelifts.test`;
  const monthlyEmail = `sim-monthly-${stamp}@emelifts.test`;
  const hash = await bcrypt.hash('solidpass1', 10);

  const wedding = await prisma.program.findUnique({ where: { planKey: 'wedding' } });
  const monthly = await prisma.program.findUnique({ where: { planKey: 'monthly' } });
  const challenge = await prisma.program.findUnique({ where: { planKey: 'challenge' } });
  assert(wedding?.id && monthly?.id && challenge?.id, 'seeded programs missing');

  await prisma.enrollment.create({
    data: {
      name: 'Wedding Sim',
      email: weddingEmail,
      plan: 'wedding',
      acceptedTerms: true,
      status: 'pending',
      passwordHash: hash,
    },
  });
  await prisma.enrollment.create({
    data: {
      name: 'Monthly Sim',
      email: monthlyEmail,
      plan: 'monthly',
      acceptedTerms: true,
      status: 'pending',
      passwordHash: hash,
    },
  });

  const paidWedding = await grantAppAccess({
    email: weddingEmail,
    name: 'Wedding Sim',
    plan: 'wedding',
    paddleTransactionId: 'txn_wed',
  });
  const paidMonthly = await grantAppAccess({
    email: monthlyEmail,
    name: 'Monthly Sim',
    plan: 'monthly',
    paddleTransactionId: 'txn_mon',
  });

  const wedMem = await prisma.membership.findFirst({
    where: { userId: paidWedding.id },
    orderBy: { createdAt: 'desc' },
  });
  const monMem = await prisma.membership.findFirst({
    where: { userId: paidMonthly.id },
    orderBy: { createdAt: 'desc' },
  });

  assert(wedMem.status === 'active', 'wedding pay should activate');
  assert(wedMem.programId === wedding.id, 'wedding pay should attach wedding program');
  assert(monMem.programId === monthly.id, 'monthly pay should attach monthly program');

  const wedCal = await calendarProgramIds(paidWedding.id);
  const monCal = await calendarProgramIds(paidMonthly.id);
  assert(wedCal.length === 1 && wedCal[0] === wedding.id, 'wedding calendar must only be wedding');
  assert(monCal.length === 1 && monCal[0] === monthly.id, 'monthly calendar must only be monthly');

  const wedCount = await prisma.scheduledSession.count({
    where: { userId: paidWedding.id, status: 'scheduled' },
  });
  const monCount = await prisma.scheduledSession.count({
    where: { userId: paidMonthly.id, status: 'scheduled' },
  });
  assert(wedCount > monCount, '12-week wedding calendar should be longer than 4-week monthly');

  const result = await scheduleProgramForUser({
    userId: paidWedding.id,
    programId: challenge.id,
    weeks: 6,
  });
  assert(result.ok, 'coach override should succeed');

  const after = await prisma.membership.findFirst({
    where: { userId: paidWedding.id },
    orderBy: { createdAt: 'desc' },
  });
  assert(after.programId === challenge.id, 'coach override should retarget membership program');
  const overrideCal = await calendarProgramIds(paidWedding.id);
  assert(
    overrideCal.length === 1 && overrideCal[0] === challenge.id,
    'after override, upcoming sessions must only be the new program'
  );
  assert(after.plan === 'wedding', 'paid plan stays wedding even if coach sends another program');

  const stillMonthly = await calendarProgramIds(paidMonthly.id);
  assert(stillMonthly[0] === monthly.id, 'override on one client must not touch the other');

  const exercise = await prisma.exercise.findFirst({
    where: { workout: { programId: monthly.id } },
  });
  await prisma.exercise.update({
    where: { id: exercise.id },
    data: { name: 'Coach renamed movement' },
  });
  const session = await prisma.scheduledSession.findFirst({
    where: { userId: paidMonthly.id, workout: { programId: monthly.id } },
    include: { workout: { include: { exercises: true } } },
  });
  assert(
    session.workout.exercises.some((e) => e.name === 'Coach renamed movement'),
    'editing a program exercise must show on every client already on that program'
  );
  await prisma.exercise.update({
    where: { id: exercise.id },
    data: { name: exercise.name },
  });

  await cleanup(weddingEmail);
  await cleanup(monthlyEmail);
  console.log(
    'E2E passed: pay assigns matching program immediately; coach can retarget one calendar; program edits fan out'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
