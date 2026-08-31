import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

// Example of @hono/zod-validator usage — validates query via Zod
export const echoRoute = new Hono()
  .get('/', zValidator('query', z.object({ message: z.string().min(1).max(100) })), c => {
    const { message } = c.req.valid('query');
    return c.json({ echo: message, at: new Date().toISOString() });
  })
  .post('/', zValidator('json', z.object({ message: z.string().min(1).max(100) })), async c => {
    const { message } = c.req.valid('json');
    return c.json({ echo: message, at: new Date().toISOString() }, 201);
  });
