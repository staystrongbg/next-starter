import { auth } from '@/lib/auth';
import { createMiddleware } from 'hono/factory';

export type AuthEnv = {
  Variables: {
    user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['user'];
    session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
  };
};

// Hono API layer middleware to extract session from request headers
// Required: 401 if no session
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const headers = new Headers();
  for (const [k, v] of Object.entries(c.req.header())) headers.set(k, v);

  const session = await auth.api.getSession({ headers });

  if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);

  c.set('user', session.user);
  c.set('session', session);

  return next();
});
