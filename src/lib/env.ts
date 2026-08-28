import 'server-only';

import { z } from 'zod';

/**
 * Centralized, validated environment variables.
 * Fails fast at boot if required secrets are missing or malformed.
 * Import from here instead of `process.env` directly in application code.
 */
const envSchema = z
  .object({
    DATABASE_URL: z.url('DATABASE_URL must be a valid URL (postgresql://...)'),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
    BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),
    EMAIL_FROM: z.email('EMAIL_FROM must be a valid email'),
    // Nodemailer: at least one of these should be present. EMAIL_FROM is the
    // display From address; NODEMAILER_EMAIL is the SMTP auth user (often same).
    // We allow empty string for optional OAuth providers due to .env placeholders.
    NODEMAILER_EMAIL: z
      .union([z.email(), z.literal('')])
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    NODEMAILER_PASSWORD: z
      .string()
      .min(1)
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    GITHUB_CLIENT_ID: z
      .string()
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    GITHUB_CLIENT_SECRET: z
      .string()
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    GOOGLE_CLIENT_ID: z
      .string()
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    GOOGLE_CLIENT_SECRET: z
      .string()
      .optional()
      .transform(v => (v === '' ? undefined : v)),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .optional()
      .default('development'),
  })
  .superRefine((val, ctx) => {
    // Require at least one Nodemailer credential: EMAIL_FROM covers From,
    // but SMTP auth needs NODEMAILER_PASSWORD (app password) or NODEMAILER_EMAIL user.
    // In practice we need NODEMAILER_PASSWORD; warn if missing.
    if (!val.NODEMAILER_PASSWORD && !val.NODEMAILER_EMAIL) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Either NODEMAILER_PASSWORD or NODEMAILER_EMAIL must be set for email delivery',
        path: ['NODEMAILER_PASSWORD'],
      });
    }
  });

type Env = z.infer<typeof envSchema>;

let parsed: Env;
try {
  parsed = envSchema.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const issues = err.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    // Fail fast: surface missing/invalid env at startup (build or runtime)
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  throw err;
}

export const env: Env = parsed;

// Convenience re-exports with friendlier names for consumers that expect them
export const databaseUrl = env.DATABASE_URL;
export const betterAuthSecret = env.BETTER_AUTH_SECRET;
export const baseUrl = env.BETTER_AUTH_URL;
export const emailFrom = env.EMAIL_FROM;
// SMTP user falls back to EMAIL_FROM when NODEMAILER_EMAIL not set
export const nodemailerEmail = env.NODEMAILER_EMAIL ?? env.EMAIL_FROM;
export const gmailServicePassword = env.NODEMAILER_PASSWORD ?? '';
export const githubClientId = env.GITHUB_CLIENT_ID ?? '';
export const githubClientSecret = env.GITHUB_CLIENT_SECRET ?? '';
export const googleClientId = env.GOOGLE_CLIENT_ID ?? '';
export const googleClientSecret = env.GOOGLE_CLIENT_SECRET ?? '';
export const environment = env.NODE_ENV;
