import { auth } from '@/auth';
import { prisma } from './prisma';

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  if (!user) return null;

  const membership = user.memberships[0];
  if (membership?.programId) {
    const program = await prisma.program.findUnique({
      where: { id: membership.programId },
    });
    user.memberships[0] = { ...membership, program };
  } else if (membership) {
    user.memberships[0] = { ...membership, program: null };
  }

  return user;
}

export function hasAppAccess(user) {
  if (!user) return false;
  if (user.role === 'coach') return true;
  const membership = user.memberships?.[0];
  return membership?.status === 'active' || membership?.status === 'complimentary';
}

export function isCoach(user) {
  return user?.role === 'coach';
}
