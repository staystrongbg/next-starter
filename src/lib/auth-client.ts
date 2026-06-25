// Helper function to get the auth client for client components
import { createAuthClient } from 'better-auth/react';

import { baseUrl } from './constants';

const isProduction = process.env.NODE_ENV !== 'development';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: isProduction ? baseUrl : 'http://localhost:3000',
});
