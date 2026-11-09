'use server';

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAppAccess, isCoach } from '@/lib/session';
import { toDateKey } from '@/lib/dates';
import { paddlePriceId } from '@/lib/plans';
import { upsertMemberAccount } from '@/lib/access';
import { programForPlan, scheduleProgramForUser } from '@/lib/schedule';
import { cleanEmail, cleanText, isId, toFiniteNumber } from '@/lib/safe';

async function requireMember() {
  const user = await getSessionUser();
  if (!user || !hasAppAccess(user)) throw new Error('Unauthorized');
  return user;
}

async function requireCoach() {
  const user = await getSessionUser();
  if (!isCoach(user)) throw new Error('Unauthorized');
  return user;
}

export async function saveSetLog({ sessionId, exerciseId, setIndex, weight, reps, rpe }) {
  const user = await requireMember();
  const session = await prisma.scheduledSession.findFirst({
    where: { id: sessionId, userId: user.id },
  });
  if (!session) throw new Error('Session not found');

  const existing = await prisma.setLog.findFirst({
    where: { sessionId, exerciseId, setIndex },
  });
  const data = {
    weight: toFiniteNumber(weight),
    reps: toFiniteNumber(reps),
    rpe: toFiniteNumber(rpe),
  };
  if (existing) {
    await prisma.setLog.update({ where: { id: existing.id }, data });
  } else {
    await prisma.setLog.create({
      data: { sessionId, exerciseId, setIndex, ...data },
    });
  }
  revalidatePath('/app');
  revalidatePath(`/app/workout/${sessionId}`);
}

export async function completeSession(sessionId) {
  const user = await requireMember();
  await prisma.scheduledSession.updateMany({
    where: { id: sessionId, userId: user.id },
    data: { status: 'completed', completedAt: new Date() },
  });
  revalidatePath('/app');
  revalidatePath(`/app/workout/${sessionId}`);
  redirect('/app');
}

export async function toggleHabit(habitId, date) {
  const user = await requireMember();
  if (!isId(habitId) || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    throw new Error('Invalid habit');
  }
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });
  if (!habit) throw new Error('Habit not found');
  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date } },
  });
  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({
      data: { habitId, userId: user.id, date, completed: true },
    });
  }
  revalidatePath('/app');
}

export async function sendMessage(toUserId, body) {
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  if (user.role === 'member' && !hasAppAccess(user)) {
    return { error: 'Access is not active yet' };
  }
  const text = cleanText(body, 2000);
  if (!text) return { error: 'Message required' };

  let targetId = toUserId;
  if (user.role === 'member') {
    const coach = await prisma.user.findFirst({ where: { role: 'coach' } });
    if (!coach) return { error: 'Coach not found' };
    targetId = coach.id;
  } else if (!isCoach(user) || !isId(targetId)) {
    return { error: 'Pick a client' };
  } else {
    const target = await prisma.user.findFirst({
      where: { id: targetId, role: 'member' },
    });
    if (!target) return { error: 'Client not found' };
  }

  if (targetId === user.id) return { error: 'Cannot message yourself' };

  await prisma.message.create({
    data: { fromUserId: user.id, toUserId: targetId, body: text },
  });
  revalidatePath('/app/messages');
  revalidatePath('/coach');
  if (user.role === 'coach') revalidatePath(`/coach/clients/${targetId}`);
  return { ok: true };
}

export async function addBodyStat(formData) {
  const user = await requireMember();
  const weight = formData.get('weight');
  const notes = String(formData.get('notes') ?? '');
  const n = toFiniteNumber(weight);
  await prisma.bodyStat.create({
    data: {
      userId: user.id,
      date: toDateKey(),
      weight: n,
      notes: cleanText(notes, 200),
    },
  });
  revalidatePath('/app/progress');
}

export async function startPaddleCheckout(formData) {
  const name = cleanText(formData.get('name'), 80);
  const email = cleanEmail(formData.get('email'));
  const plan = String(formData.get('plan') ?? 'monthly');
  const accepted = formData.get('terms') === 'on';
  const password = String(formData.get('password') ?? '');
  if (!name || !email || !accepted) {
    return { error: 'Name, email, and terms are required.' };
  }
  if (password.length < 8 || password.length > 200) {
    return { error: 'Password must be 8 to 200 characters.' };
  }
  if (!['monthly', 'challenge', 'wedding'].includes(plan)) {
    return { error: 'Pick a plan.' };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await upsertMemberAccount({ email, name, passwordHash, plan });
  } catch (error) {
    return { error: error.message || 'Could not create account.' };
  }
  await prisma.enrollment.create({
    data: {
      name,
      email,
      plan,
      acceptedTerms: true,
      status: 'pending',
      passwordHash,
    },
  });
  const priceId = paddlePriceId(plan);
  if (!priceId) {
    return { error: 'That plan is not available for checkout yet.', email, name, plan, priceId: '' };
  }
  return { ok: true, email, name, plan, priceId };
}

export async function requestMagicLink(email) {
  const normalized = String(email ?? '').trim().toLowerCase();
  if (!normalized) return { error: 'Email required' };
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return { ok: true };
  }
  const token = randomBytes(24).toString('hex');
  await prisma.magicLink.create({
    data: {
      email: normalized,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 30),
    },
  });
  const origin = process.env.AUTH_URL || 'http://localhost:3000';
  const devLink = `${origin}/login?token=${token}`;
  return { ok: true, devLink: process.env.NODE_ENV === 'production' ? null : devLink };
}

export async function coachActivateMember(userId) {
  await requireCoach();
  const latest = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  if (latest) {
    await prisma.membership.update({
      where: { id: latest.id },
      data: { status: 'active', startDate: latest.startDate ?? new Date() },
    });
  } else {
    await prisma.membership.create({
      data: { userId, plan: 'monthly', status: 'active', startDate: new Date() },
    });
  }
  await prisma.enrollment.updateMany({
    where: { userId, status: 'pending' },
    data: { status: 'active' },
  });
  revalidatePath('/coach');
}

export async function coachPauseMember(userId) {
  await requireCoach();
  const latest = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  if (latest) {
    await prisma.membership.update({
      where: { id: latest.id },
      data: { status: 'paused' },
    });
  }
  revalidatePath('/coach');
}

export async function coachInviteMember(formData) {
  await requireCoach();
  const name = cleanText(formData.get('name'), 80);
  const email = cleanEmail(formData.get('email'));
  const plan = String(formData.get('plan') ?? 'complimentary');
  const password = String(formData.get('password') ?? '');
  if (!name || !email) return { error: 'Name and email required' };
  if (password.length < 8 || password.length > 200) {
    return { error: 'Password must be 8 to 200 characters' };
  }
  if (!['complimentary', 'monthly', 'challenge', 'wedding'].includes(plan)) {
    return { error: 'Pick a plan' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'That email already has an account' };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: 'member',
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  await prisma.membership.create({
    data: {
      userId: user.id,
      plan,
      status: plan === 'complimentary' ? 'complimentary' : 'active',
      startDate: new Date(),
    },
  });
  for (const habitName of ['10k steps', 'Protein at each meal', 'Sleep by 11']) {
    await prisma.habit.create({ data: { userId: user.id, name: habitName } });
  }
  const program = await programForPlan(plan);
  if (program) {
    await scheduleProgramForUser({ userId: user.id, programId: program.id });
  }
  revalidatePath('/coach');
  redirect(`/coach/clients/${user.id}`);
}

export async function coachCreateProgram(formData) {
  await requireCoach();
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  if (!name) return { error: 'Program name required' };
  const planKeyRaw = String(formData.get('planKey') ?? 'custom');
  const planKey =
    planKeyRaw === 'monthly' || planKeyRaw === 'challenge' || planKeyRaw === 'wedding'
      ? planKeyRaw
      : `custom-${Date.now()}`;
  const clash = await prisma.program.findUnique({ where: { planKey } });
  if (clash) return { error: 'That checkout plan already has a program.' };
  await prisma.program.create({ data: { name, description, planKey } });
  revalidatePath('/coach/programs');
}

export async function coachSaveProgram(formData) {
  await requireCoach();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  if (!id || !name) return { error: 'Name required' };
  const planKeyRaw = String(formData.get('planKey') ?? '');
  const data = { name, description };
  if (planKeyRaw === 'monthly' || planKeyRaw === 'challenge' || planKeyRaw === 'wedding') {
    data.planKey = planKeyRaw;
  } else if (planKeyRaw === 'custom') {
    const current = await prisma.program.findUnique({ where: { id } });
    if (current && !current.planKey.startsWith('custom-')) {
      data.planKey = `custom-${Date.now()}`;
    }
  }
  try {
    await prisma.program.update({ where: { id }, data });
  } catch (error) {
    if (error?.code === 'P2002') return { error: 'That checkout plan already has a program.' };
    throw error;
  }
  revalidatePath('/coach/programs');
}

export async function coachAddWorkout(formData) {
  await requireCoach();
  const programId = String(formData.get('programId') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const durationMin = Number(formData.get('durationMin') || 40);
  const dayOffset = Number(formData.get('dayOffset') || 0);
  const notes = String(formData.get('notes') ?? '').trim();
  if (!programId || !name) return { error: 'Workout name required' };
  const count = await prisma.workout.count({ where: { programId } });
  await prisma.workout.create({
    data: {
      programId,
      name,
      durationMin: Number.isFinite(durationMin) ? durationMin : 40,
      dayOffset: Math.min(6, Math.max(0, dayOffset)),
      notes,
      sortOrder: count,
    },
  });
  revalidatePath('/coach/programs');
}

export async function coachSaveWorkout(formData) {
  await requireCoach();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const durationMin = Number(formData.get('durationMin') || 40);
  const dayOffset = Number(formData.get('dayOffset') || 0);
  const notes = String(formData.get('notes') ?? '').trim();
  if (!id || !name) return { error: 'Workout name required' };
  await prisma.workout.update({
    where: { id },
    data: {
      name,
      durationMin: Number.isFinite(durationMin) ? durationMin : 40,
      dayOffset: Math.min(6, Math.max(0, dayOffset)),
      notes,
    },
  });
  revalidatePath('/coach/programs');
  revalidatePath('/app');
}

export async function coachAddExercise(formData) {
  await requireCoach();
  const workoutId = String(formData.get('workoutId') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const sets = Number(formData.get('sets') || 3);
  const reps = String(formData.get('reps') ?? '8-10').trim() || '8-10';
  const restSec = Number(formData.get('restSec') || 90);
  if (!workoutId || !name) return { error: 'Exercise name required' };
  const count = await prisma.exercise.count({ where: { workoutId } });
  await prisma.exercise.create({
    data: {
      workoutId,
      name,
      sets: Number.isFinite(sets) ? sets : 3,
      reps,
      restSec: Number.isFinite(restSec) ? restSec : 90,
      sortOrder: count,
    },
  });
  revalidatePath('/coach/programs');
  revalidatePath('/app');
}

export async function coachSaveExercise(formData) {
  await requireCoach();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const sets = Number(formData.get('sets') || 3);
  const reps = String(formData.get('reps') ?? '8-10').trim() || '8-10';
  const restSec = Number(formData.get('restSec') || 90);
  if (!id || !name) return { error: 'Exercise name required' };
  await prisma.exercise.update({
    where: { id },
    data: {
      name,
      sets: Number.isFinite(sets) ? sets : 3,
      reps,
      restSec: Number.isFinite(restSec) ? restSec : 90,
    },
  });
  revalidatePath('/coach/programs');
  revalidatePath('/app');
}

export async function coachDeleteExercise(formData) {
  await requireCoach();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.exercise.delete({ where: { id } });
  revalidatePath('/coach/programs');
  revalidatePath('/app');
}

export async function coachPushProgram(formData) {
  await requireCoach();
  const programId = String(formData.get('programId') ?? '');
  const weeks = Number(formData.get('weeks') || 0);
  const userIds = formData.getAll('userIds').map(String).filter(isId);
  if (!isId(programId)) return { error: 'Program required' };
  if (!userIds.length) return { error: 'Select at least one client calendar' };

  const members = await prisma.user.findMany({
    where: { id: { in: userIds }, role: 'member' },
    select: { id: true },
  });
  for (const member of members) {
    await scheduleProgramForUser({
      userId: member.id,
      programId,
      startDate: toDateKey(),
      weeks: weeks > 0 ? weeks : undefined,
    });
  }
  revalidatePath('/coach/programs');
  revalidatePath('/coach');
  revalidatePath('/app');
}

export async function coachAssignProgram(formData) {
  await requireCoach();
  const userId = String(formData.get('userId'));
  const programId = String(formData.get('programId'));
  const startDate = String(formData.get('startDate') || toDateKey());
  const weeks = Number(formData.get('weeks') || 0);
  if (!isId(userId) || !isId(programId)) return { error: 'Invalid selection' };
  const member = await prisma.user.findFirst({ where: { id: userId, role: 'member' } });
  if (!member) return { error: 'Client not found' };
  const result = await scheduleProgramForUser({
    userId,
    programId,
    startDate,
    weeks: weeks > 0 ? weeks : undefined,
  });
  if (result?.error) return result;
  revalidatePath(`/coach/clients/${userId}`);
  revalidatePath('/app');
}

export async function coachFulfillEnrollment(enrollmentId) {
  await requireCoach();
  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment) return { error: 'Not found' };

  let user = await prisma.user.findUnique({ where: { email: enrollment.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: enrollment.name,
        email: enrollment.email,
        role: 'member',
        passwordHash:
          enrollment.passwordHash || (await bcrypt.hash(crypto.randomUUID(), 10)),
      },
    });
    for (const habitName of ['10k steps', 'Protein at each meal', 'Sleep by 11']) {
      await prisma.habit.create({ data: { userId: user.id, name: habitName } });
    }
  }
  await prisma.membership.create({
    data: {
      userId: user.id,
      plan: enrollment.plan,
      status: 'active',
      startDate: new Date(),
    },
  });
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: 'active', userId: user.id },
  });

  const program = await programForPlan(enrollment.plan);
  if (program) {
    await scheduleProgramForUser({
      userId: user.id,
      programId: program.id,
    });
  }
  revalidatePath('/coach');
  redirect(`/coach/clients/${user.id}`);
}

export async function changePassword(formData) {
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  if (next.length < 8 || next.length > 200) {
    return { error: 'New password must be 8 to 200 characters.' };
  }
  if (current === next) return { error: 'Pick a different password.' };
  const row = await prisma.user.findUnique({ where: { id: user.id } });
  if (!row?.passwordHash) return { error: 'No password set.' };
  const ok = await bcrypt.compare(current, row.passwordHash);
  if (!ok) return { error: 'Current password is wrong.' };
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  revalidatePath('/app/profile');
  revalidatePath('/coach');
  return { ok: true };
}

export async function coachSaveMovement(formData) {
  await requireCoach();
  const id = String(formData.get('id') ?? '');
  const youtubeUrl = String(formData.get('youtubeUrl') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();
  if (!id) return { error: 'Missing movement' };
  await prisma.movement.update({
    where: { id },
    data: { youtubeUrl, notes },
  });
  revalidatePath('/coach/movements');
  revalidatePath('/app');
}

export async function coachAddMovement(formData) {
  await requireCoach();
  const name = String(formData.get('name') ?? '').trim();
  const youtubeUrl = String(formData.get('youtubeUrl') ?? '').trim();
  if (!name) return { error: 'Name required' };
  await prisma.movement.create({ data: { name, youtubeUrl } });
  revalidatePath('/coach/movements');
}
