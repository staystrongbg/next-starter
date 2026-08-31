import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import 'server-only';

import {
  baseUrl,
  betterAuthSecret,
  emailFrom,
  environment,
  githubClientId,
  githubClientSecret,
  googleClientId,
  googleClientSecret,
  productionUrl,
} from './env';
import { prisma } from './prisma';
import { sendMail } from './send-email';

const isLocalEnv = environment === 'development';

const trustedOrigins = [baseUrl, productionUrl].filter(Boolean) as string[];

const effectiveBaseUrl = isLocalEnv ? baseUrl : productionUrl;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  baseURL: effectiveBaseUrl,
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
