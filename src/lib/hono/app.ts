import { Hono } from 'hono';
import { logger } from 'hono/logger';

// Basic Hono server — second layer for API requests
// All app data access should go through here (mounted at /api/hono/*)
export const app = new Hono().basePath('/api/hono');

app.use(logger());

// Example: health check (no validation)
app.get('/health', c => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Import modular routes (with zod-validator)
import { echoRoute } from './routes/echo';
import { healthRoute } from './routes/health';

app.route('/health', healthRoute);
app.route('/echo', echoRoute);

app.notFound(c => c.json({ error: 'Not Found', path: c.req.path }, 404));
app.onError((err, c) => {
  console.error('[hono] error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

export type AppType = typeof app;
