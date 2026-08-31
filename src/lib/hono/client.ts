import { hc } from 'hono/client';

import type { AppType } from './app';

// Typed client for the basic Hono server — use in Client Components
export const honoClient = hc<AppType>(
  typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin,
  {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input as RequestInfo, { ...init, credentials: 'include' }),
  },
);
