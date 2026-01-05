import { User } from 'better-auth';
import { createAuthClient } from 'better-auth/react';

export interface AuthClientType {
  authClient: ReturnType<typeof createAuthClient>;
}

export interface IUser {
  user: User;
}
