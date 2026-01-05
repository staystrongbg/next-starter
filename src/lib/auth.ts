import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import {
  databaseUrl,
  emailFrom,
  githubClientId,
  githubClientSecret,
  googleClientId,
  googleClientSecret,
} from './constants';
import { sendMail } from './send-email';

const adapter = new PrismaLibSql({
  url: databaseUrl,
});

const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendMail({
        email: emailFrom,
        sendTo: user.email,
        subject: 'Reset your password',
        html: `<p>Hello ${user.name || 'User'},</p><p>Here is the link to reset your password: <a href="${url}">Reset Password</a></p>`,
      });
    },
  },
  socialProviders: {
    github: {
      enabled: false,
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
    google: {
      enabled: false,
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ url, user }) {
      await sendMail({
        email: emailFrom,
        sendTo: user.email,
        subject: 'Verify your email',
        html: `<p>Hello ${user.name || 'User'},</p><p>Here is the link to verify your email: <a href="${url}">Verify Email</a></p>`,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
});
