import 'server-only';

import {
  baseUrl as validatedBaseUrl,
  databaseUrl as validatedDatabaseUrl,
  emailFrom as validatedEmailFrom,
  environment as validatedEnvironment,
  githubClientId as validatedGithubClientId,
  githubClientSecret as validatedGithubClientSecret,
  gmailServicePassword as validatedGmailServicePassword,
  googleClientId as validatedGoogleClientId,
  googleClientSecret as validatedGoogleClientSecret,
  nodemailerEmail as validatedNodemailerEmail,
} from './env';

// Re-export client-safe constants from single source of truth (client-constants).
// Keeping re-export here preserves compatibility for server imports that use `from './constants'`.
export { LINKS, MAX_PASSWORD_STRENGTH, MIN_PASSWORD_STRENGTH_SCORE } from './client-constants';

// Re-export validated env (single source of truth in src/lib/env.ts)
// EMAIL_FROM = display From address; NODEMAILER_EMAIL = SMTP auth user (falls back to EMAIL_FROM)
const emailFrom = validatedEmailFrom;
const nodemailerEmail = validatedNodemailerEmail;
const gmailServicePassword = validatedGmailServicePassword;

const githubClientId = validatedGithubClientId;
const githubClientSecret = validatedGithubClientSecret;

const googleClientId = validatedGoogleClientId;
const googleClientSecret = validatedGoogleClientSecret;

const environment = validatedEnvironment;
const baseUrl = validatedBaseUrl;

const databaseUrl = validatedDatabaseUrl;
export {
  baseUrl,
  databaseUrl,
  emailFrom,
  environment,
  githubClientId,
  githubClientSecret,
  gmailServicePassword,
  googleClientId,
  googleClientSecret,
  nodemailerEmail,
};
