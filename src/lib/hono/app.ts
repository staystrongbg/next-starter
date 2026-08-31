import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { echoRoute } from './routes/echo';
import { healthRoute } from './routes/health';

// All app data access goes through here (mounted at /api/hono/*)
// Chain .route() so AppType retains full type inference for hc<AppType>
// protect api routes with requireAuth middleware
export const app = new Hono()
  .basePath('/api/hono')
  .use(logger())
  .get('/health', c => c.json({ status: 'ok', timestamp: new Date().toISOString() }))
  .route('/health', healthRoute)
  .route('/echo', echoRoute);

app.notFound(c => c.json({ error: 'Not Found', path: c.req.path }, 404));
app.onError((err, c) => {
  console.error('[hono] error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

export type AppType = typeof app;
