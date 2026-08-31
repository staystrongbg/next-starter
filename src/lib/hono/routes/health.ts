import { Hono } from 'hono';

export const healthRoute = new Hono().get('/check', c =>
  c.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() }),
);
