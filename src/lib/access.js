import { prisma } from './prisma';
import { programForPlan, scheduleProgramForUser } from './schedule';
import { weeksForPlan } from './plans';

async function ensureHabits(userId) {
  const count = await prisma.habit.count({ where: { userId } });
  if (count > 0) return;
  for (const habitName of ['10k steps', 'Protein at each meal', 'Sleep by 11']) {
    await prisma.habit.create({ data: { userId, name: habitName } });
  }
}

export async function upsertMemberAccount({ email, name, passwordHash, plan }) {
  const normalized = String(email).trim().toLowerCase();
  let user = await prisma.user.findUnique({ where: { email: normalized } });

  if (user?.role === 'coach') {
    throw new Error('That email is the coach account.');
  }

  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          name: name || normalized.split('@')[0],
          email: normalized,
          role: 'member',
          passwordHash,
        },
      });
    } catch (error) {
      if (error?.code !== 'P2002') throw error;
      user = await prisma.user.findUnique({ where: { email: normalized } });
    }
  } else if (passwordHash) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: name || user.name, passwordHash },
    });
    user = await prisma.user.findUnique({ where: { id: user.id } });
  } else if (name && name !== user.name) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
  }

  await ensureHabits(user.id);

  const latest = await prisma.membership.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (!latest) {
    await prisma.membership.create({
      data: {
        userId: user.id,
        plan: plan || 'monthly',
        status: 'pending',
      },
    });
  } else if (latest.status !== 'active' && plan) {
    await prisma.membership.update({
      where: { id: latest.id },
      data: { plan },
    });
  }

  return user;
}

export async function grantAppAccess({
  email,
  name,
  plan,
  paddleCustomerId = '',
  paddleSubscriptionId = '',
  paddleTransactionId = '',
}) {
  const normalized = String(email).trim().toLowerCase();
  const enrollment = await prisma.enrollment.findFirst({
    where: { email: normalized },
    orderBy: { createdAt: 'desc' },
  });
  const resolvedPlan = plan || enrollment?.plan || 'monthly';

  const user = await upsertMemberAccount({
    email: normalized,
    name: name || enrollment?.name,
    passwordHash: enrollment?.passwordHash || undefined,
    plan: resolvedPlan,
  });

  const latest = await prisma.membership.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const data = {
    plan: resolvedPlan,
    status: 'active',
    startDate: latest?.startDate || new Date(),
  };
  if (paddleCustomerId) data.paddleCustomerId = paddleCustomerId;
  if (paddleSubscriptionId) data.paddleSubscriptionId = paddleSubscriptionId;
  if (paddleTransactionId) data.paddleTransactionId = paddleTransactionId;

  if (latest) {
    await prisma.membership.update({ where: { id: latest.id }, data });
  } else {
    await prisma.membership.create({ data: { userId: user.id, ...data } });
  }

  await prisma.enrollment.updateMany({
    where: { email: normalized, status: 'pending' },
    data: { status: 'active', userId: user.id },
  });

  const program = await programForPlan(resolvedPlan);
  if (program?.workouts?.length) {
    await scheduleProgramForUser({
      userId: user.id,
      programId: program.id,
      weeks: weeksForPlan(resolvedPlan),
    });
  }

  return user;
}

export async function pauseAppAccess({ email, paddleSubscriptionId }) {
  const user = email
    ? await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } })
    : null;

  const membership = await prisma.membership.findFirst({
    where: user
      ? { userId: user.id }
      : { paddleSubscriptionId: paddleSubscriptionId || '__none__' },
    orderBy: { createdAt: 'desc' },
  });

  if (!membership) return;
  await prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'paused' },
  });
}
