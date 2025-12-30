import { createAuthClient } from 'better-auth/react';

export interface AuthClientType {
  authClient: ReturnType<typeof createAuthClient>;
}
