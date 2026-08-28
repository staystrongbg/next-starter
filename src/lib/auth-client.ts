// Helper function to get the auth client for client components
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  /** Base URL is optional when using same domain; using window.location.origin on client.
   *  Avoid importing from server-only `src/lib/constants` / `src/lib/env` (would leak DATABASE_URL).
   *  Better Auth will default to the current origin when baseURL is omitted.
   */
});
