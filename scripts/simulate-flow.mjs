import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { grantAppAccess, pauseAppAccess, upsertMemberAccount } from '../src/lib/access.js';

const prisma = new PrismaClient();
const email = `sim-${Date.now()}@emelifts.test`;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const passwordHash = await bcrypt.hash('solidpass1', 10);
  const user = await upsertMemberAccount({
    email,
    name: 'Sim Customer',
    passwordHash,
    plan: 'monthly',
  });
  const pending = await prisma.membership.findFirst({ where: { userId: user.id } });
  assert(pending?.status === 'pending', 'enroll should leave membership pending');

  await prisma.enrollment.create({
    data: {
      name: 'Sim Customer',
      email,
      plan: 'monthly',
      acceptedTerms: true,
      status: 'pending',
      passwordHash,
      userId: user.id,
    },
  });

  await grantAppAccess({
    email,
    name: 'Sim Customer',
    plan: 'monthly',
    paddleTransactionId: 'txn_1',
  });
  await grantAppAccess({
    email,
    name: 'Sim Customer',
    plan: 'monthly',
    paddleCustomerId: 'ctm_1',
    paddleSubscriptionId: 'sub_1',
    paddleTransactionId: 'txn_1',
  });

  const memberships = await prisma.membership.findMany({ where: { userId: user.id } });
  assert(memberships.length === 1, 'webhook retry must not duplicate membership');
  assert(memberships[0].status === 'active', 'paid member must be active');
  assert(memberships[0].paddleCustomerId === 'ctm_1', 'second event should fill paddle ids');

  const sessions = await prisma.scheduledSession.count({ where: { userId: user.id } });
  assert(sessions > 0, 'paid member must get a calendar');

  const habits = await prisma.habit.count({ where: { userId: user.id } });
  assert(habits === 3, 'member gets starter habits once');

  await pauseAppAccess({ email });
  const paused = await prisma.membership.findFirst({ where: { userId: user.id } });
  assert(paused.status === 'paused', 'cancel/past_due must pause access');

  await grantAppAccess({ email, plan: 'monthly' });
  const resumed = await prisma.membership.findFirst({ where: { userId: user.id } });
  assert(resumed.status === 'active', 're-pay must restore access');

  await prisma.setLog.deleteMany({ where: { session: { userId: user.id } } });
  await prisma.scheduledSession.deleteMany({ where: { userId: user.id } });
  await prisma.habitLog.deleteMany({ where: { userId: user.id } });
  await prisma.habit.deleteMany({ where: { userId: user.id } });
  await prisma.membership.deleteMany({ where: { userId: user.id } });
  await prisma.enrollment.deleteMany({ where: { email } });
  await prisma.user.delete({ where: { id: user.id } });

  console.log('E2E simulation passed: enroll → pay(retry) → calendar → pause → restore');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
