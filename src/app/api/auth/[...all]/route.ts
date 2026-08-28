import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Better Auth handler – exposes all auth endpoints under /api/auth/*
// See https://www.better-auth.com/docs/reference/security for rate-limiting options.
// TODO: Add rate limiting (e.g. ArcJet, Upstash Ratelimit, or next-rate-limit)
// at the edge/proxy layer for /api/auth/* to mitigate brute-force on
// sign-in, sign-up, and password-reset. Better Auth also supports
// `rateLimit` in `betterAuth({ rateLimit: { ... } })` if using Redis/memory store.
export const { POST, GET } = toNextJsHandler(auth);
