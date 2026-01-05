const LINKS = [{ href: '/', label: 'Home' }];

const emailFrom = process.env.EMAIL_FROM as string;
const gmailServicePassword = process.env.NODEMAILER_PASSWORD as string;

const githubClientId = process.env.GITHUB_CLIENT_ID as string;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET as string;

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

const environment = process.env.NODE_ENV as string;

const databaseUrl = process.env.DATABASE_URL as string;
export {
  databaseUrl,
  emailFrom,
  environment,
  githubClientId,
  githubClientSecret,
  gmailServicePassword,
  googleClientId,
  googleClientSecret,
  LINKS,
};
