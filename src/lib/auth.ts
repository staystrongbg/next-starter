import 'server-only';

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import {
  baseUrl,
  emailFrom,
  githubClientId,
  githubClientSecret,
  googleClientId,
  googleClientSecret,
} from './constants';
import { betterAuthSecret } from './env';
import { prisma } from './prisma';
import { sendMail } from './send-email';

const normalizedBaseUrl = baseUrl?.replace(/\/+$/, '');

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  baseURL: normalizedBaseUrl,
  secret: betterAuthSecret,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
    expiresIn: 3600, // 1 hour – aligns with Verification.expiresAt TTL
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
      // Require verification before email is actually changed (was true – insecure)
      updateEmailWithoutVerification: false,
    },
    deleteUser: {
      enabled: true,
    },
  },
  trustedOrigins: normalizedBaseUrl ? [normalizedBaseUrl] : [],
});
