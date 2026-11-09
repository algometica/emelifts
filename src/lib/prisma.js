import { PrismaClient } from '@prisma/client';

if (process.env.VERCEL && process.env.DATABASE_URL?.startsWith('file:')) {
  throw new Error('Production needs a Neon Postgres DATABASE_URL, not SQLite.');
}

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
