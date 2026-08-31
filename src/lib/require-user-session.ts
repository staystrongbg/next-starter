//  Helper function to get the user session in server components
import { headers } from 'next/headers';
import { cache } from 'react';

import { auth } from './auth';

export const requireUserSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ?? null;
});
