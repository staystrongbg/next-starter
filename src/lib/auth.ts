// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
});
