const LINKS = [{ href: '/', label: 'Home' }];
const MAX_PASSWORD_STRENGTH = 5;

const emailFrom = process.env.EMAIL_FROM as string;
const gmailServicePassword = process.env.NODEMAILER_PASSWORD as string;

const githubClientId = process.env.GITHUB_CLIENT_ID as string;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET as string;

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

const environment = process.env.NODE_ENV as string;
const baseUrl = process.env.BETTER_AUTH_URL as string;

const databaseUrl = process.env.DATABASE_URL as string;
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
  LINKS,
  MAX_PASSWORD_STRENGTH,
};
