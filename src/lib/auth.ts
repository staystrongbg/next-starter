import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import 'server-only';

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
const vercelPreviewUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`
  : undefined;
const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`
  : undefined;

const trustedOrigins = Array.from(
  new Set(
    [
      normalizedBaseUrl,
      vercelPreviewUrl,
      vercelProdUrl,
      'https://next-starter-bice.vercel.app',
      'https://*.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter(Boolean) as string[],
  ),
);

// Diagnostic logging for Vercel env mismatch (BETTER_AUTH_URL still localhost). Remove after verified.
console.log('[auth] baseURL:', normalizedBaseUrl);
console.log('[auth] trustedOrigins:', trustedOrigins);
console.log('[auth] VERCEL_URL:', process.env.VERCEL_URL);
console.log('[auth] VERCEL_PROJECT_PRODUCTION_URL:', process.env.VERCEL_PROJECT_PRODUCTION_URL);

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
  trustedOrigins,
});
